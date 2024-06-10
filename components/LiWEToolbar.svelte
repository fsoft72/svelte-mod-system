<script lang="ts">
	import ThemeSwitcher from '$liwe3/components/ThemeSwitcher.svelte';
	import Avatar from '$modules/user/components/Avatar.svelte';
	import { storeUser } from '$modules/user/store.svelte';
</script>

{#if storeUser?.uid}
	<div class="toolbar">
		LiWE Toolbar
		<div class="item">
			<slot />
		</div>
		<div class="row">
			<ThemeSwitcher />
			<Avatar user={storeUser} />
		</div>
	</div>
	<div class="spacer" />
{/if}

<style>
	.toolbar {
		background: linear-gradient(90deg, rgba(130, 140, 173, 0.3) 0%, rgba(5, 39, 127, 1) 100%);
		backdrop-filter: blur(10px);
		position: fixed;
		top: 0;
		left: 0;

		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 50px;
		width: 100%;
		z-index: 1001;

		padding: 0 1rem;
	}

	.spacer {
		margin-top: 50px;
	}

	.toolbar .item {
		border: 1px solid #fff;
		border-radius: 5px;
		padding: 5px;
		background-color: #ff0099;
		margin: 5px;
	}

	.row {
		display: flex;
		align-items: center;
		gap: 2rem;
	}
</style>
