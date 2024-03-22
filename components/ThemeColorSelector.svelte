<script lang="ts">
	import Button from '$liwe3/components/Button.svelte';
	import Input from '$liwe3/components/Input.svelte';
	import { downloadFile } from '$liwe3/utils/utils';
	import { themeSetMode } from '../theme';
	import { theme, themeModes, themeSetDarkMode, themeSetModeColor } from '../theme_store';

	const setColor = (mode: string, color: string) => {
		themeSetModeColor($theme.theme, mode, color);
	};

	const setDarkMode = (darkMode: boolean) => {
		themeSetDarkMode(darkMode);
		themeSetMode(darkMode ? 'dark' : 'light');
	};

	const exportJSON = () => {
		const data = {
			light: $theme.light,
			dark: $theme.dark
		};
		console.log('=== EXPORT: ', data);
		const json = JSON.stringify(data, null, 2);
		downloadFile(json, 'theme.json', 'application/json');
	};
</script>

<div class="container">
	<div class="liwe3-row">
		<div class="liwe3-col4">
			<div class="theme-selector">
				<Input
					type="checkbox"
					checked={$theme.theme === 'dark'}
					on:change={(e) => setDarkMode(e.target.checked)}
					label="Dark mode"
				/>
				<Button mode="info" on:click={exportJSON}>Export JSON</Button>
			</div>
		</div>
		<div class="liwe3-col8 tweekers">
			<div class="liwe3-row">
				{#each themeModes as mode}
					<div class="liwe3-col2">
						<span>{mode} </span>
						<span>
							{#if $theme.theme === 'dark'}
								<input
									type="color"
									on:change={(e) => setColor(mode, e.target?.value)}
									value={$theme.dark[mode]}
								/>
							{:else}
								<input
									type="color"
									on:change={(e) => setColor(mode, e.target?.value)}
									value={$theme.light[mode]}
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

	.theme-selector {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: flex-start;

		height: 100%;
	}
</style>
