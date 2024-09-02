<script lang="ts">
	import Button from '$liwe3/components/Button.svelte';
	import DataGrid, {
		type DataGridAction,
		type DataGridRow
	} from '$liwe3/components/DataGrid.svelte';
	import { _ } from '$liwe3/stores/LocalizationStore';
	import { onMount } from 'svelte';
	import gridFields from './subs/domains_fields';
	import type { SystemDomain } from '../types';
	import Paginator from '$liwe3/components/Paginator.svelte';
	import {
		system_admin_domain_add,
		system_admin_domain_update,
		system_admin_domains_list,
		system_domain_create_invite
	} from '../actions';
	import Modal from '$liwe3/components/Modal.svelte';
	import SystemDomainEdit from './SystemDomainEdit.svelte';
	import { PencilSquare, Trash } from 'svelte-hero-icons';

	let currentRow: any = null;
	let totRows: number = 0;
	let maxRowsPerPage = 50;
	let inv = '';

	let domains: SystemDomain[] = [];
	let displayDomains: DataGridRow[] = [];
	let filteredDomains: SystemDomain[] = [];

	let editModalOpen = false;
	let deleteModalOpen = false;
	let inviteModalOpen = false;

	let actions: DataGridAction[] = [
		{
			id: 'invite',
			label: 'Invite',
			icon: PencilSquare,
			mode: 'mode3',
			action: async (row: any) => {
				inv = await system_domain_create_invite(row.id);
				inviteModalOpen = true;
			}
		},
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
	{#key displayDomains}
		<DataGrid
			data={displayDomains}
			fields={gridFields}
			{actions}
			onupdatefield={async (row, field_name) => {
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
	{/key}
</div>

{#if deleteModalOpen}
	<Modal
		title={$_('Delete domain')}
		onclose={() => {
			domains = domains.filter((r) => r.id !== currentRow.id);
			deleteModalOpen = false;
		}}
		oncancel={() => {
			deleteModalOpen = false;
		}}
	>
		{$_('Please confirm you want to delete domain')}<br />
		<div class="delete-domain">{currentRow?.code} / {currentRow?.name}</div>

		<div class="buttons">
			<Button mode="error" onclick={deleteDomain}>{$_('Delete Domain')}</Button>
			<Button mode="info" onclick={() => (deleteModalOpen = false)}>{$_('Cancel')}</Button>
		</div>
	</Modal>
{/if}

{#if editModalOpen}
	<Modal
		title={$_('Edit domain')}
		onclose={() => {
			editModalOpen = false;
		}}
		oncancel={() => {
			editModalOpen = false;
		}}
	>
		<SystemDomainEdit domain={currentRow} on:domain={(e) => onDomain(e.detail)} />
	</Modal>
{/if}

{#if inviteModalOpen}
	<Modal
		title={$_('Invite token')}
		size="md"
		onclose={() => {
			inviteModalOpen = false;
		}}
		oncancel={() => {
			inviteModalOpen = false;
		}}
	>
		<div class="invite-token">
			Invite token is:
			<div class="token">{inv}</div>
		</div>
	</Modal>
{/if}

<style>
	.container {
		width: 100%;
		background-color: var(--liwe3-dark-600);
		border-radius: var(--liwe3-border-radius);
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

	.invite-token {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 1rem;
	}

	.token {
		font-family: monospace;
		font-size: 80%;
		width: 70%;
		padding: 1rem;
		background-color: var(--liwe3-dark-400);
		border-radius: var(--liwe3-border-radius);
		word-wrap: break-word; /* Add this line */
	}
</style>
