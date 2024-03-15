<script lang="ts">
	import { theme, themeLayoutVars, themeLayoutUnits, themeSetLayoutVar, themeSetLayoutVars } from '../theme_store';
	import Input from '$liwe3/components/Input.svelte';

    const formatValue = {
        clean: ( name:string, value: string ) => {
            const val = value.replace(themeLayoutUnits[name],'').trim();
            return val;
        },
        full: ( name:string, value: string ) => ['number','string'].includes(themeLayoutUnits[name]) ? value : value + themeLayoutUnits[name]
    }

	const setVar = (rule: string, value: string) => {
		themeSetLayoutVar( rule, value);
	};
</script>

<div class="container">
	<div class="liwe3-row">
		<div class="liwe3-col12">
			<div class="liwe3-row liwe3-flex-between">
				{#each themeLayoutVars as rule, idx}
					<div class="liwe3-col1 liwe3-p1 x">
						<span>
                                {#if ['rem','number'].includes(themeLayoutUnits[rule])}
                                    <Input
                                        type="number"
                                        step=".05"
                                        on:change={(e) => setVar(rule, formatValue.full(rule, e.target?.value))}
                                        value={formatValue.clean(rule, $theme.vars[rule])}
                                        label={`${rule} (${themeLayoutUnits[rule]})`}
                                    />
                                {:else if themeLayoutUnits[rule] == 'px'}
                                    <Input
                                        type="number"
                                        step="1"
                                        on:change={(e) => setVar(rule, formatValue.full(rule, e.target?.value))}
                                        value= {formatValue.clean(rule, $theme.vars[rule])}
                                        label={`${rule} (${themeLayoutUnits[rule]})`}
                                    />
                                {:else if themeLayoutUnits[rule] == 'string'}
                                    <Input
                                        type="text"
                                        on:change={(e) => setVar(rule, formatValue.full(rule, e.target?.value))}
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
                                        on:change={(e) => setVar(rule, formatValue.full(rule, e.target?.value))}
                                        value={formatValue.clean(rule, $theme.vars[rule])}
                                    />
                            {/if}
						</span>
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>

<style>
	.container {
		padding: 20px;
	}
</style>
