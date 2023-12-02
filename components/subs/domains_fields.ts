import type { GridField } from '$liwe3/components/DataGrid.svelte';

const fields: GridField[] = [
	{
		name: 'id',
		label: 'ID',
		type: 'string',
		hidden: true,
	},
	{
		name: 'code',
		label: 'Code',
		type: 'string',
		sortable: true,
	},
	{
		name: 'name',
		label: 'Name',
		type: 'string',
		sortable: true,
	},
	{
		name: 'visible',
		label: 'Visible',
		type: 'boolean',
	},
];

export default fields;