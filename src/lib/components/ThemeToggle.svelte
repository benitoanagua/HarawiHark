<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';

	let isDark = $state(false);

	onMount(() => {
		if (browser) {
			isDark = document.documentElement.classList.contains('dark');
		}
	});

	function toggle() {
		if (!browser) return;

		const root = document.documentElement;
		isDark = !isDark;

		if (isDark) {
			root.classList.add('dark');
			localStorage.theme = 'dark';
		} else {
			root.classList.remove('dark');
			localStorage.theme = 'light';
		}
	}
</script>

<button
	class="p-2 rounded-full transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
	onclick={toggle}
	aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
	title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
>
	{#if isDark}
		<span class="i-carbon-sun text-lg text-yellow-500"></span>
	{:else}
		<span class="i-carbon-moon text-lg text-gray-600"></span>
	{/if}
</button>
