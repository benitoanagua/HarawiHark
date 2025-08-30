<script lang="ts">
	// La lógica del theme se implementará posteriormente
	let isDark = $state(false);

	function toggleTheme() {
		isDark = !isDark;
		// Aquí se agregará la lógica para cambiar el theme después
		console.log('Theme toggled:', isDark ? 'dark' : 'light');
	}
</script>

<button
	class="p-2 rounded-full transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
	onclick={toggleTheme}
	aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
	title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
>
	{#if isDark}
		<span class="i-carbon-sun text-lg text-yellow-500"></span>
	{:else}
		<span class="i-carbon-moon text-lg text-gray-600"></span>
	{/if}
</button>
