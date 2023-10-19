<script lang="ts">
	import Select from 'svelte-select';

	import Button from '$liwe3/components/Button.svelte';
	import Input from '$liwe3/components/Input.svelte';
	import Tabs from '$liwe3/components/Tabs.svelte';
	import Tab from '$liwe3/components/sub/Tab.svelte';
	import DataGrid, {
		type GridAction,
		type GridDataRow,
		type GridField
	} from '$liwe3/components/DataGrid.svelte';
	import type { Color } from '$liwe3/types/types';

	const ranges = [900, 800, 700, 600, 500, 400, 300, 200, 100, 50];
	const fields: GridField[] = [
		{
			name: 'id',
			type: 'string',
			label: 'ID',
			hidden: true
		},
		{
			name: 'email',
			type: 'string',
			label: 'Email',
			sortable: true,
			filterable: true,
			editable: true
		},
		{
			name: 'first_name',
			type: 'string',
			label: 'First Name',
			sortable: true,
			filterable: true,
			editable: true
		},
		{
			name: 'last_name',
			type: 'string',
			label: 'Last Name',
			sortable: true,
			filterable: true,
			editable: true
		}
	];

	const data: GridDataRow[] = [
		{
			id: '1',
			first_name: 'John',
			last_name: 'Doe',
			email: 'jdoe@example.com'
		},
		{
			id: '2',
			first_name: 'Jane',
			last_name: 'Doe',
			email: 'jane@example.com'
		},
		{
			id: '3',
			first_name: 'John',
			last_name: 'Smith',
			email: 'jj@example.com'
		},
		{
			id: '4',
			first_name: 'Jane',
			last_name: 'Smith',
			email: 'smith@ssss.com'
		}
	];

	const actions: GridAction[] = [
		{
			id: 'a1',
			label: 'Edit',
			action: (row: GridDataRow) => {
				console.log('=== EDIT: ', row);
			}
		},
		{
			id: 'a2',
			label: 'Delete',
			action: (row: GridDataRow) => {
				console.log('=== DELETE: ', row);
			},
			mode: 'error'
		}
	];

	let darkMode = false;

	const modes: Color[] = [
		'mode1',
		'mode2',
		'mode3',
		'mode4',
		'info',
		'error',
		'warning',
		'success'
	];
</script>

<div class="container">
	Dark Mode: <input type="checkbox" bind:checked={darkMode} />
	<div class={darkMode ? 'liwe3-dark-theme' : 'liwe3-light-theme'}>
		<Tabs>
			<Tab id="colors" title="Colors">
				<div class="colors">
					{#each ['mode1', 'mode2', 'mode3', 'mode4', 'info', 'error', 'warning', 'success'] as name}
						<div class="col">
							{#each ranges as val}
								<div class="color" style={`background-color: var(--liwe3-${name}-${val});`}>
									{name} - {val}
								</div>
							{/each}
						</div>
					{/each}
				</div>
			</Tab>
			<Tab id="buttons" title="Buttons">
				{#each modes as mode}
					<div class="row">
						<Button {mode} variant="solid">{mode} - solid - Click me</Button>
						<Button {mode} variant="outline">{mode} - outline - Click me</Button>
						<Button {mode} variant="link">{mode} - link - Click me</Button>
						<Button {mode} disabled>{mode} - disabled</Button>
					</div>
				{/each}
			</Tab>
			<Tab id="inputs" title="Inputs">
				<div class="row">
					{#each modes as mode}
						<Input {mode} label="Input" placeholder={mode} />
					{/each}
				</div>
			</Tab>
			<Tab id="selects" title="Selects">
				<div class="row">
					{#each ['mode1', 'mode2', 'mode3', 'mode4'] as mode}
						<Select class={mode} items={['mode1', 'mode2', 'mode3', 'mode4']} />
					{/each}
				</div>
			</Tab>
			<Tab id="grids" title="DataGrids">
				<div class="col">
					<DataGrid mode="mode1" {fields} {data} {actions} />
					<DataGrid mode="mode2" {fields} {data} {actions} />
					<DataGrid mode="mode3" {fields} {data} {actions} />
					<DataGrid mode="mode4" {fields} {data} {actions} />
				</div>
			</Tab>
		</Tabs>
	</div>
</div>

<style>
	.color {
		width: 150px;
		height: 50px;
		margin: 5px;
		border-radius: 10px;

		display: flex;
		justify-content: center;
		align-items: center;
	}

	.colors {
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		justify-content: flex-start;
	}

	.col {
		display: flex;
		flex-direction: column;

		gap: 1rem;
	}

	.row {
		display: flex;
		flex-direction: row;
		gap: 0.5rem;

		margin-bottom: 0.5rem;
	}
</style>
