<script lang="ts">
	import Button from '$liwe3/components/Button.svelte';
	import DataGrid, { type GridAction, type GridDataRow } from '$liwe3/components/DataGrid.svelte';
	import { _ } from '$liwe3/stores/LocalizationStore';
	import { onMount } from 'svelte';
	import gridFields from './subs/domains_fields';
	import type { SystemDomain } from '../types';
	import Paginator from '$liwe3/components/Paginator.svelte';
	import {
		system_admin_domain_add,
		system_admin_domain_update,
		system_admin_domains_list
	} from '../actions';
	import Modal from '$liwe3/components/Modal.svelte';
	import SystemDomainEdit from './SystemDomainEdit.svelte';
	import { PencilSquare, Trash } from 'svelte-hero-icons';

	let currentRow: any = null;
	let editModalOpen = false;
	let deleteModalOpen = false;
	let totRows: number = 0;
	let maxRowsPerPage = 50;

	let domains: SystemDomain[] = [];
	let displayDomains: GridDataRow[] = [];
	let filteredDomains: SystemDomain[] = [];

	let actions: GridAction[] = [
		{
			id: 'edit',
			label: 'Edit',
			icon: PencilSquare,
			mode: 'mode1',
			action: (row: any) => {
				currentRow = row;
				editModalOpen = true;
			}
		},
		{
			id: 'delete',
			label: 'Delete',
			icon: Trash,
			mode: 'error',
			action: (row: any) => {
				currentRow = row;
				deleteModalOpen = true;
			}
		}
	];

	const deleteDomain = async () => {
		console.log('=== DELETE DOMAIN', currentRow);
	};

	const onDomain = async (domain: SystemDomain) => {
		let res;

		if (domain?.id.length) {
			res = await system_admin_domain_update(domain.id, domain.code, domain.name, domain.visible);
		} else {
			res = await system_admin_domain_add(domain.code, domain.name, domain.visible);
		}

		if (res.error) return;

		updateDomains();
	};

	const updateDomains = async () => {
		const res = await system_admin_domains_list();

		if (res.error) return;

		domains = res;
	};

	$: {
		filteredDomains = domains || [];
		displayDomains = filteredDomains.slice(0, maxRowsPerPage);
	}

	onMount(async () => {
		updateDomains();
	});
</script>

<div class="container">
	<div class="buttons">
		<p class="title">{$_('System Domains List')}</p>
		<Button
			mode="mode2"
			size="sm"
			on:click={() => {
				currentRow = { id: '' };
				editModalOpen = true;
			}}
		>
			{$_('Create Domain')}
		</Button>
	</div>
	<DataGrid
		data={displayDomains}
		fields={gridFields}
		{actions}
		updateField={async (row, field_name) => {
			console.log('updateField', row, field_name);
			// const res = await user_admin_fields(row.id, { [field_name]: row[field_name] });

			// if (res.error) return;
		}}
	/>
	<Paginator
		total={totRows}
		rows={maxRowsPerPage}
		on:pagechange={(e) => {
			displayDomains = filteredDomains.slice(
				(e.detail.page - 1) * maxRowsPerPage,
				e.detail.page * maxRowsPerPage
			);
		}}
	/>
</div>

{#if deleteModalOpen}
	<Modal
		title={$_('Delete domain')}
		on:confirm={() => {
			domains = domains.filter((r) => r.id !== currentRow.id);
			deleteModalOpen = false;
		}}
		on:cancel={() => {
			deleteModalOpen = false;
		}}
	>
		{$_('Please confirm you want to delete domain')}<br />
		<div class="delete-domain">{currentRow?.code} / {currentRow?.name}</div>

		<div slot="footer">
			<Button mode="error" on:click={deleteDomain}>{$_('Delete Domain')}</Button>
			<Button mode="info" on:click={() => (deleteModalOpen = false)}>{$_('Cancel')}</Button>
		</div>
	</Modal>
{/if}

{#if editModalOpen}
	<Modal
		title={$_('Edit domain')}
		on:confirm={() => {
			editModalOpen = false;
		}}
		on:cancel={() => {
			editModalOpen = false;
		}}
	>
		<SystemDomainEdit domain={currentRow} on:domain={(e) => onDomain(e.detail)} />
	</Modal>
{/if}

<style>
	.container {
		width: 100%;
		background-color: var(--liwe3-dark-600);
		border-radius: var(--liwe-border-radius);
		padding-bottom: 0.01rem;
	}
	.delete-domain {
		font-weight: bold;
		text-align: center;
		padding: 10px;
	}

	.buttons {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.3rem 1rem;

		gap: 1rem;
	}
</style>
