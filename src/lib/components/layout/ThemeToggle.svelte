<script lang="ts">
	import { onMount } from 'svelte';

	let theme: 'light' | 'dark' = 'light';
	let mounted = false;

	function toggleTheme() {
		theme = theme === 'light' ? 'dark' : 'light';
		document.documentElement.setAttribute('data-theme', theme);
		localStorage.setItem('theme', theme);
	}

	onMount(() => {
		const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
		const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
			? 'dark'
			: 'light';
		theme = savedTheme || systemTheme;
		document.documentElement.setAttribute('data-theme', theme);
		mounted = true;
	});
</script>

<button
	on:click={toggleTheme}
	class="flex items-center gap-2 p-2 rounded-full bg-surfaceContainer text-onSurface hover:bg-surfaceContainerHigh transition-colors"
	aria-label={theme === 'light' ? 'Cambiar a tema oscuro' : 'Cambiar a tema claro'}
>
	{#if mounted}
		{#if theme === 'light'}
			<span class="i-carbon:sun"></span>
		{:else}
			<span class="i-carbon:moon"></span>
		{/if}
	{/if}
</button>
