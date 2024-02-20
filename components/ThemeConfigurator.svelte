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
	import TagInput from '$liwe3/components/TagInput.svelte';

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

	let testMode: Color = 'mode1';
	let showModal = false;
	// define default modes
	const modes: Color[] = [
		'mode1',
		'mode2',
		'mode3',
		'mode4',
		'info',
		'error',
		'warning',
		'success',
		'dark',
		'background',
		'color',
		'link'
	];
	// init light and dark themes
	let light: Record<string, string> = {};
	let dark: Record<string, string> = {};
	// define base colors
	modes.map((mode) => {
		light[mode] = '#333333';
		dark[mode] = '#333333';
	});
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
		is_ready &&
			themeCreate([
				{
					light: {
						mode1: rgbHexToInt(light.mode1),
						mode2: rgbHexToInt(light.mode2),
						mode3: rgbHexToInt(light.mode3),
						mode4: rgbHexToInt(light.mode4),
						background: rgbHexToInt(light.background),
						color: rgbHexToInt(light.color),
						link: rgbHexToInt(light.link),
						info: rgbHexToInt(light.info),
						error: rgbHexToInt(light.error),
						warning: rgbHexToInt(light.warning),
						success: rgbHexToInt(light.success)
					}
				},
				{
					dark: {
						mode1: rgbHexToInt(dark.mode1),
						mode2: rgbHexToInt(dark.mode2),
						mode3: rgbHexToInt(dark.mode3),
						mode4: rgbHexToInt(dark.mode4),
						background: rgbHexToInt(dark.background),
						color: rgbHexToInt(dark.color),
						link: rgbHexToInt(dark.link),
						info: rgbHexToInt(dark.info),
						error: rgbHexToInt(dark.error),
						warning: rgbHexToInt(dark.warning),
						success: rgbHexToInt(dark.success)
					}
				}
			]);
	}
	onMount(() => {
		const tc = themeColors();
		//iterate on tc and set the colors
		tc.map((theme, idx) => {
			Object.entries(tc[idx]).map(([themeType, colors]) => {
				Object.entries(colors).map(([k, v]) => {
					themeType === 'dark' ? (dark[k] = intToRGBHex(v)) : (light[k] = intToRGBHex(v));
				});
			});
		});
		is_ready = true;
	});
</script>

<div class="container liwe3-light-theme">
	<div class="liwe3-row">
		<div class="liwe3-col">
			<h1>Theme Configurator</h1>
		</div>
	</div>
	<div class="liwe3-row">
		<div class="liwe3-col4">
			<div class="theme-selector">
				<h4>Theme swicth:</h4>
				<div>Dark mode &nbsp;&nbsp;<input type="checkbox" bind:checked={darkMode} /></div>
			</div>
		</div>
		<div class="liwe3-col8 tweekers">
			<h4>Colors:</h4>
			<div class="liwe3-row">
				{#each modes as mode}
					<div class="liwe3-col2">
						<span>{mode} </span>
						<span>
							{#if darkMode}
								<input type="color" bind:value={dark[mode]} />
							{:else}
								<input type="color" bind:value={light[mode]} />
							{/if}
						</span>
					</div>
				{/each}
			</div>
		</div>
	</div>
	<div class="liwe3-row" class:liwe3-dark-theme={darkMode} class:liwe3-light-theme={!darkMode}>
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
				<div class="liwe3-row">
					{#each modes as name}
						<div class="color">
							{#each ranges as val}
								{#if ['background', 'color', 'link'].includes(name)}
									<div
										class="color"
										style={`background-color: var(--liwe3-${
											darkMode ? 'dark' : 'light'
										}-${name}-${val});`}
									>
										<div class="color-text">{name}<br />{val}</div>
									</div>
								{:else}
									<div class="color" style={`background-color: var(--liwe3-${name}-${val});`}>
										<div class="color-text">{name}<br />{val}</div>
									</div>
								{/if}
							{/each}
						</div>
					{/each}
				</div>
			</Tab>
			<Tab id="buttons" title="Buttons">
				<div class="liwe3-row">
					{#each modes.slice(0, 9) as mode}
						<div class="liwe3-col3">
							<span class="m5"
								><Button {mode} variant="solid">{mode} - solid - Click me</Button></span
							>
						</div>
						<div class="liwe3-col3">
							<span class="m5"
								><Button {mode} variant="outline">{mode} - outline - Click me</Button></span
							>
						</div>
						<div class="liwe3-col3">
							<span class="m5"><Button {mode} variant="link">{mode} - link - Click me</Button></span
							>
						</div>
						<div class="liwe3-col3">
							<span class="m5"><Button {mode} disabled>{mode} - disabled</Button></span>
						</div>
					{/each}
				</div>
			</Tab>
			<Tab id="inputs" title="Inputs">
				{#each modes as mode}
					<div class="liwe3-row">
						{#each ['text', 'number', 'password', 'email', 'url', 'tel'] as type}
							<Input
								{mode}
								divClass="liwe3-col2"
								class=""
								label="Input"
								placeholder={mode}
								{type}
							/>
						{/each}
					</div>
					<div class="liwe3-row">
						{#each ['search', 'checkbox'] as type}
							<Input
								{mode}
								divClass="liwe3-col2"
								class=""
								label="Input"
								placeholder={mode}
								{type}
							/>
						{/each}
						<div class="liwe3-col2 p5">
							<div class="cform-switch cform-custom-switch">
								<Input type="checkbox" id={`switch-${mode}`} />
								<label for={`switch-${mode}`} />
							</div>
						</div>
						<div class="liwe3-col2 p5">
							<div class={`${mode} radio-group cform-radio-group`}>
								<input type="radio" id={`${mode}-option-one3`} name="selector3" checked />
								<label for={`${mode}-option-one3`}>Html</label>
								<input type="radio" id={`${mode}-option-two3`} name="selector3" />
								<label for={`${mode}-option-two3`}>Css</label>
								<input type="radio" id={`${mode}-option-three3`} name="selector3" />
								<label for={`${mode}-option-three3`}>Javascript</label>
							</div>
						</div>
						<div class="liwe3-col2 m5">
							<fieldset class="cform cform-custom-input">
								<legend>Textarea</legend>
								<textarea class="cform cutom-input-cform" rows="4" placeholder={mode} />
							</fieldset>
						</div>
					</div>
				{/each}
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
					Tag Input
					<div class="row">
						<TagInput mode="mode1" allowNewTags={true} />
						<TagInput mode="mode2" allowNewTags={true} />
						<TagInput mode="mode3" allowNewTags={true} />
						<TagInput mode="mode4" allowNewTags={true} />
					</div>
				</div>
			</Tab>
		</Tabs>
	</div>
</div>

<style>
	.color {
		flex: 0 0 0.075%;
		min-width: 7.5%;
		max-width: 100%;
		height: 4rem;
		min-height: 4rem;
		margin: 5px;
		border-radius: 10px;
		text-align: center;
		text-overflow: clip;

		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: stretch;
	}

	.color-text {
		flex: 1;
		display: flex;
		flex-direction: column;
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

	.m5 {
		margin: 5px;
	}

	.tweekers {
		margin-bottom: 1rem;
	}
	.theme-selector {
		flex: 0.5;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: flex-start;
		gap: 0.5rem;
	}
</style>
