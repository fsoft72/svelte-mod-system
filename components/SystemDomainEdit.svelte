<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	import FormCreator from '$liwe3/components/FormCreator.svelte';
	import type { FormField } from '$liwe3/components/FormCreator.svelte';
	import type { SystemDomain } from '../types';

	interface Props {
		domain: SystemDomain;
	}

	let { domain }: Props = $props();

	let fields: FormField[] = [
		{
			name: 'id',
			label: 'ID',
			type: 'hidden',
			required: true
		},
		{
			name: 'code',
			label: 'Code',
			type: 'text',
			required: true,
			placeholder: 'code',
			col: 4
		},
		{
			name: 'name',
			label: 'Name',
			type: 'text',
			required: true,
			placeholder: 'Name',
			col: 6
		},
		{
			name: 'visible',
			label: 'Visible',
			type: 'checkbox',
			required: false,
			col: 2
		}
	];

	const dispatch = createEventDispatcher();

	const onSubmit = (data: any) => {
		dispatch('domain', data);
	};
</script>

<div class="container">
	<FormCreator {fields} values={domain} on:submit={(e) => onSubmit(e.detail)} />
</div>
