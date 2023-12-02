<script lang="ts">
	import Button from '$liwe3/components/Button.svelte';
	import DataGrid, { type GridAction, type GridDataRow } from '$liwe3/components/DataGrid.svelte';
	import { _ } from '$liwe3/stores/LocalizationStore';
	import { has_perm } from '$liwe3/utils/utils';
	import { user } from '$modules/user/store';
	import { onMount } from 'svelte';
	import gridFields from './subs/domains_fields';
	import type { SystemDomain } from '../types';
	import Paginator from '$liwe3/components/Paginator.svelte';
	import { system_admin_domains_list } from '../actions';
	import Modal from '$liwe3/components/Modal.svelte';
	import SystemDomainEdit from './SystemDomainEdit.svelte';

	let currentRow: any = null;
	let editModalOpen = false;
	let deleteModalOpen = false;
	let totRows: number = 0;
	let maxRowsPerPage = 50;

	let domains: SystemDomain[] = [];
	let displayDomains: GridDataRow[] = [];
	let filteredDomains: SystemDomain[] = [];

	let actions: GridAction[] = [];

	const deleteDomain = async () => {
		console.log('=== DELETE DOMAIN', currentRow);
	};

	$: {
		filteredDomains = domains || [];
		displayDomains = filteredDomains.slice(0, maxRowsPerPage);
	}

	onMount(async () => {
		const res = await system_admin_domains_list();

		if (res.error) return;

		domains = res;
	});
</script>

<div class="container">
	<div class="buttons">
		<p class="title">{$_('System Domains List')}</p>
		{#if has_perm($user, 'user.create')}
			<Button
				mode="mode2"
				size="sm"
				href="/user/create"
				on:click={() => {
					currentRow = { id: '' };
					editModalOpen = true;
				}}
			>
				{$_('Create user')}
			</Button>
		{/if}
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
		title="Delete user"
		on:confirm={() => {
			domains = domains.filter((r) => r.id !== currentRow.id);
			deleteModalOpen = false;
		}}
		on:cancel={() => {
			deleteModalOpen = false;
		}}
	>
		Please confirm you want to delete user<br />
		<div class="delete-user">{currentRow?.email}</div>

		<div slot="footer">
			<Button mode="error" on:click={deleteDomain}>Delete User</Button>
			<Button mode="info" on:click={() => (deleteModalOpen = false)}>Cancel</Button>
		</div>
	</Modal>
{/if}

{#if editModalOpen}
	<Modal
		title="Edit user"
		on:confirm={() => {
			editModalOpen = false;
		}}
		on:cancel={() => {
			editModalOpen = false;
		}}
	>
		<SystemDomainEdit domain={currentRow} />
	</Modal>
{/if}

<style>
	.container {
		width: 100%;
		background-color: var(--liwe3-dark-600);
		border-radius: var(--liwe-border-radius);
		padding-bottom: 0.01rem;
	}
	.delete-user {
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
