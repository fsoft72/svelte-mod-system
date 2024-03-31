<script lang="ts">
	import { theme, themeLayoutUnits, themeSetLayoutVar, themeSetLayoutVars, themeResetLayoutVars } from '../theme_store';
	import Input from '$liwe3/components/Input.svelte';
	import { keys } from '$liwe3/utils/utils';
	import { ArrowUturnLeft } from 'svelte-hero-icons';
	import Button from '$liwe3/components/Button.svelte';

	type allowedUnits = 'px' | 'rem' | '%' | 'number' | 'string';
	const formatValue = {
		clean: (name: string, value: string) => {
			const val = value ? value.replace(themeLayoutUnits[name], '').trim() : '';
			return val;
		},
		full: (name: string, value: string) => {
			return ['number', 'string'].includes(themeLayoutUnits[name]) ? value : value + themeLayoutUnits[name]
		}
	};

	const setVar = (rule: string, value: string) => {
		themeSetLayoutVar(rule, value);
	};

	const resetVars = () => {
		confirm("Are you sure you want to reset the variables?") ?
		themeResetLayoutVars() : null;
	};

	const onVarChange = (e: Event, rule: allowedUnits) => {
		const target = e.target as HTMLInputElement;
		const value = formatValue.full(rule, target.value) || '';
		setVar(rule, value);
	};

</script>

<div class="container">
	<div class="liwe3-row">
		<div class="liwe3-col12">
			<div class="liwe3-row liwe3-flex-bottom">
				{#each keys(themeLayoutUnits) as rule, idx}
					<div class="liwe3-col-xxl1 liwe3-col-xs2">
						<span>
							{#if ['rem', 'number'].includes(themeLayoutUnits[rule])}
								<Input
									type="number"
									step=".05"
									min="0"
									on:change={ (e) => onVarChange(e, rule)}
									value={formatValue.clean(rule, $theme.vars[rule])}
									label={`${rule} (${themeLayoutUnits[rule]})`}
								/>
							{:else if themeLayoutUnits[rule] == 'px'}
								<Input
									type="number"
									step="1"
									min="0"
									on:change={ (e) => onVarChange(e, rule)}
									value={formatValue.clean(rule, $theme.vars[rule])}
									label={`${rule} (${themeLayoutUnits[rule]})`}
								/>
							{:else if themeLayoutUnits[rule] == 'string'}
								<Input
									type="text"
									on:change={ (e) => onVarChange(e, rule)}
									value={formatValue.clean(rule, $theme.vars[rule])}
									label={`${rule} (${themeLayoutUnits[rule]})`}
								/>
							{:else if themeLayoutUnits[rule] == '%'}
								<label for={rule}>{rule} ({themeLayoutUnits[rule]})</label>
								<input
									type="range"
									min="0"
									max="100"
									class="slider"
									on:change={ (e) => onVarChange(e, rule) }
									value={formatValue.clean(rule, $theme.vars[rule])}
								/>
							{/if}
						</span>
					</div>
				{/each}
				<div class="liwe3-offset-xxl1 liwe3-col-xxl1 liwe3-offset-xs2 liwe3-col-xs2">
					<Button
						on:click={resetVars}
						placeholder="Reset"
						mode="warning"
						label="Reset"
						size="sm"
						iconRight= {ArrowUturnLeft}
					>
					Reset
					</Button>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.container {
		padding: 20px;
	}
</style>
