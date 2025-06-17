<script lang="ts">
	import { run } from 'svelte/legacy';

	import Button from '$liwe3/components/Button.svelte';
	import DataGrid, {
		type DataGridAction,
		type DataGridButton,
		type DataGridRow,
	} from '$liwe3/components/DataGrid.svelte';
	import LocalizationStore from '$liwe3/stores/LocalizationStore.svelte';
	import { onMount } from 'svelte';
	import gridFields from './subs/domains_fields';
	import type { SystemDomain } from '../types';
	import Paginator from '$liwe3/components/Paginator.svelte';
	import {
		system_admin_domain_add,
		system_admin_domain_update,
		system_admin_domains_list,
		system_domain_create_invite,
	} from '../actions';
	import Modal from '$liwe3/components/Modal.svelte';
	import SystemDomainEdit from './SystemDomainEdit.svelte';
	import { PencilSquare, Trash } from 'svelte-hero-icons';
	import { mkid } from '$liwe3/utils/utils';

	const _ = LocalizationStore._;

	let currentRow: any = $state(null);
	let totRows: number = 0;
	let maxRowsPerPage = 50;
	let inv = $state('');

	let domains: SystemDomain[] = $state([]);
	let displayDomains: DataGridRow[] = $state([]);
	let filteredDomains: SystemDomain[] = $state([]);

	let editModalOpen = $state(false);
	let deleteModalOpen = $state(false);
	let inviteModalOpen = $state(false);

	let actions: DataGridAction[] = [
		{
			id: 'invite',
			label: 'Invite',
			icon: PencilSquare,
			mode: 'mode3',
			onclick: async (row: any) => {
				inv = await system_domain_create_invite(row.id);
				inviteModalOpen = true;
			},
		},
		{
			id: 'edit',
			label: 'Edit',
			icon: PencilSquare,
			mode: 'mode1',
			onclick: (row: any) => {
				currentRow = row;
				editModalOpen = true;
			},
		},
		{
			id: 'delete',
			label: 'Delete',
			icon: Trash,
			mode: 'error',
			onclick: (row: any) => {
				currentRow = row;
				deleteModalOpen = true;
			},
		},
	];

	let buttons: DataGridButton[] = [
		{
			id: 'create',
			label: _('Create Domain'),
			icon: 'plus',
			mode: 'mode2',
			onclick: () => {
				currentRow = { id: '', code: '', name: '', visible: true };
				editModalOpen = true;
			},
		},
	];

	const deleteDomain = async () => {
		console.log('=== DELETE DOMAIN', currentRow);
	};

	const onDomain = async (domain: Record<string, any>) => {
		let res;

		if (domain?.id.length) {
			res = await system_admin_domain_update(domain.id, domain.code, domain.name, domain.visible);
		} else {
			res = await system_admin_domain_add(domain.code, domain.name, domain.visible);
		}

		if (res.error) return;

		updateDomains();

		editModalOpen = false;
	};

	const updateDomains = async () => {
		const res = await system_admin_domains_list();

		if (res.error) return;

		domains = res;
	};

	$effect(() => {
		filteredDomains = domains || [];
		displayDomains = filteredDomains.slice(0, maxRowsPerPage);
	});

	onMount(async () => {
		updateDomains();
	});
</script>

<div class="container">
	{#key displayDomains}
		<DataGrid
			title={_('Domains')}
			data={displayDomains}
			fields={gridFields}
			{actions}
			{buttons}
			onupdatefield={async (row, field_name) => {
				console.log('updateField', row, field_name);
				// const res = await user_admin_fields(row.id, { [field_name]: row[field_name] });

				// if (res.error) return;
			}}
		/>
		<Paginator
			total={totRows}
			rows={maxRowsPerPage}
			onpagechange={(page: number, maxRowsPerPage: number) => {
				displayDomains = filteredDomains.slice(page - 1 * maxRowsPerPage, page * maxRowsPerPage);
			}}
		/>
	{/key}
</div>

{#if deleteModalOpen}
	<Modal
		title={_('Delete domain')}
		onclose={() => {
			domains = domains.filter((r) => r.id !== currentRow.id);
			deleteModalOpen = false;
		}}
		oncancel={() => {
			deleteModalOpen = false;
		}}
	>
		{_('Please confirm you want to delete domain')}<br />
		<div class="delete-domain">{currentRow?.code} / {currentRow?.name}</div>

		<div class="buttons">
			<Button mode="error" onclick={deleteDomain}>{_('Delete Domain')}</Button>
			<Button mode="info" onclick={() => (deleteModalOpen = false)}>{_('Cancel')}</Button>
		</div>
	</Modal>
{/if}

{#if editModalOpen}
	<Modal
		title={_('Edit domain')}
		onclose={() => {
			editModalOpen = false;
		}}
		oncancel={() => {
			editModalOpen = false;
		}}
	>
		<SystemDomainEdit domain={currentRow} onsubmit={onDomain} />
	</Modal>
{/if}

{#if inviteModalOpen}
	<Modal
		title={_('Invite token')}
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
