<script lang="ts">
	import FormCreator from '$liwe3/components/FormCreator.svelte';
	import type { FormField } from '$liwe3/components/FormCreator.svelte';
	import type { SystemDomain } from '../types';

	interface Props {
		domain: SystemDomain;
		onsubmit: (data: Record<string, any>) => void;
	}

	let { domain, onsubmit }: Props = $props();

	let fields: FormField[] = [
		{
			name: 'id',
			label: 'ID',
			type: 'hidden',
			required: false,
		},
		{
			name: 'code',
			label: 'Code',
			type: 'text',
			required: true,
			placeholder: 'code',
			col: 4,
		},
		{
			name: 'name',
			label: 'Name',
			type: 'text',
			required: true,
			placeholder: 'Name',
			col: 6,
		},
		{
			name: 'visible',
			label: 'Visible',
			type: 'checkbox',
			required: false,
			col: 2,
		},
	];
</script>

<div class="container">
	<FormCreator {fields} values={domain} {onsubmit} />
</div>
