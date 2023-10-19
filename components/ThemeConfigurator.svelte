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
	import { themeColors, themeCreate } from '../theme';
	import { onMount } from 'svelte';
	import AutoComplete from '$liwe3/components/AutoComplete.svelte';
	import MarkdownInput from '$liwe3/components/MarkdownInput.svelte';
	import Modal from '$liwe3/components/Modal.svelte';
	import ProgressBar from '$liwe3/components/ProgressBar.svelte';
	import DraggableTree from '$liwe3/components/DraggableTree.svelte';
	import ElementList from '$liwe3/components/ElementList.svelte';

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
	let mode: Color = 'mode1';

	let is_ready = false;

	const colors: Record<string, string> = {
		mode1: '#000000',
		mode2: '#000000',
		mode3: '#000000',
		mode4: '#000000',
		info: '#000000',
		error: '#000000',
		warning: '#000000',
		success: '#000000',
		dark: '#000000'
	};

	let mode1 = colors.mode1;
	let mode2 = colors.mode2;
	let mode3 = colors.mode3;
	let mode4 = colors.mode4;

	let testMode: Color = 'mode1';
	let showModal = false;

	const modes: Color[] = [
		'mode1',
		'mode2',
		'mode3',
		'mode4',
		'info',
		'error',
		'warning',
		'success',
		'dark'
	];

	// gets a string like '#ff00a0' and returns [ 255, 0, 160 ]
	const rgbHexToInt = (rgb: string) => {
		const r = parseInt(rgb.slice(1, 3), 16);
		const g = parseInt(rgb.slice(3, 5), 16);
		const b = parseInt(rgb.slice(5, 7), 16);

		return [r, g, b];
	};

	const intToRGBHex = (rgb: number[]) => {
		const r = rgb[0].toString(16).padStart(2, '0');
		const g = rgb[1].toString(16).padStart(2, '0');
		const b = rgb[2].toString(16).padStart(2, '0');

		return `#${r}${g}${b}`;
	};

	$: {
		is_ready && themeCreate('colors', { mode1: rgbHexToInt(mode1) });
	}

	$: {
		is_ready && themeCreate('colors', { mode2: rgbHexToInt(mode2) });
	}

	$: {
		is_ready && themeCreate('colors', { mode3: rgbHexToInt(mode3) });
	}

	$: {
		is_ready && themeCreate('colors', { mode4: rgbHexToInt(mode4) });
	}

	onMount(() => {
		const tc = themeColors();
		Object.keys(tc).map((key) => {
			colors[key] = intToRGBHex(tc[key]);
		});

		mode1 = colors.mode1;
		mode2 = colors.mode2;
		mode3 = colors.mode3;
		mode4 = colors.mode4;

		is_ready = true;
	});
</script>

<div class="container liwe3-light-theme">
	<div class="tweekers">
		<div>
			Dark Mode: <input type="checkbox" bind:checked={darkMode} />
		</div>
		<div>
			Mode:
			<select bind:value={mode}>
				{#each modes as mode}
					<option value={mode}>{mode}</option>
				{/each}
			</select>
		</div>
		<div>
			Colors:
			<input type="color" bind:value={mode1} />
			<input type="color" bind:value={mode2} />
			<input type="color" bind:value={mode3} />
			<input type="color" bind:value={mode4} />
		</div>
	</div>
	<div class={darkMode ? 'liwe3-dark-theme' : 'liwe3-light-theme'}>
		{#if showModal}
			<Modal
				title="Theme modal test"
				size="md"
				mode={testMode}
				on:cancel={() => {
					showModal = false;
				}}
				on:close={() => {
					showModal = false;
				}}
			>
				<h1>Modal test</h1>
				<p>Modal test</p>
			</Modal>
		{/if}
		<Tabs {mode}>
			<Tab id="colors" title="Colors">
				<div class="colors">
					{#each modes as name}
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
				<div class="row form">
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
			<Tab id="dragtree" title="Draggable Tree">
				<div class="row">
					<DraggableTree mode="mode1" />
					<DraggableTree mode="mode2" />
					<DraggableTree mode="mode3" />
					<DraggableTree mode="mode4" />
				</div>
			</Tab>
			<Tab id="elements" title="Elements List">
				<div class="row">
					<ElementList mode="mode1" />
					<ElementList mode="mode2" />
					<ElementList mode="mode3" />
					<ElementList mode="mode4" />
				</div>
			</Tab>
			<Tab id="controls" title="Controls">
				<div class="col form">
					Autocomplete
					<div class="row">
						<AutoComplete mode="mode1" items={['mode1', 'mode2', 'mode3', 'mode4']} />
						<AutoComplete mode="mode2" items={['mode1', 'mode2', 'mode3', 'mode4']} />
						<AutoComplete mode="mode3" items={['mode1', 'mode2', 'mode3', 'mode4']} />
						<AutoComplete mode="mode4" items={['mode1', 'mode2', 'mode3', 'mode4']} />
					</div>
					Markdown
					<div class="col">
						<MarkdownInput rows={2} mode="mode1" />
						<MarkdownInput rows={2} mode="mode2" />
						<MarkdownInput rows={2} mode="mode3" />
						<MarkdownInput rows={2} mode="mode4" />
					</div>
					Modals
					<div class="row">
						<Button
							mode="mode1"
							on:click={() => {
								testMode = 'mode1';
								showModal = true;
							}}>Open Modal</Button
						>
						<Button
							mode="mode2"
							on:click={() => {
								testMode = 'mode2';
								showModal = true;
							}}>Open Modal</Button
						>
						<Button
							mode="mode3"
							on:click={() => {
								testMode = 'mode3';
								showModal = true;
							}}>Open Modal</Button
						>
						<Button
							mode="mode4"
							on:click={() => {
								testMode = 'mode4';
								showModal = true;
							}}>Open Modal</Button
						>
					</div>
					Progress Bar
					<div class="row">
						<ProgressBar mode="mode1" percentage={50} />
						<ProgressBar mode="mode2" percentage={50} />
						<ProgressBar mode="mode3" percentage={50} />
						<ProgressBar mode="mode4" percentage={50} />
					</div>
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

	.tweekers {
		display: flex;
		flex-direction: row;
		gap: 2rem;
	}
</style>
