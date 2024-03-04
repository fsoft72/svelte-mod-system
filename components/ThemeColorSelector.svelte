<script lang="ts">
	import { themeSetMode } from '../theme';
	import { theme, themeModes, themeSetDarkMode, themeSetModeColor } from '../theme_store';

	const setColor = (mode: string, color: string) => {
		themeSetModeColor($theme.theme, mode, color);
	};

	const setDarkMode = (darkMode: boolean) => {
		themeSetDarkMode(darkMode);
		themeSetMode(darkMode ? 'dark' : 'light');
	};
</script>

<div class="container">
	<div class="liwe3-row">
		<div class="liwe3-col4">
			<div class="theme-selector">
				Dark mode &nbsp;&nbsp;<input
					type="checkbox"
					checked={$theme.theme === 'dark'}
					on:change={(e) => setDarkMode(e.target.checked)}
				/>
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
</style>
