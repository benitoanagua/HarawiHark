<script lang="ts">
	import { browser } from '$app/environment';

	function toggle() {
		if (!browser) return;
		const root = document.documentElement;
		const isDark = root.classList.toggle('dark');
		localStorage.theme = isDark ? 'dark' : 'light';
	}
</script>

<button
	class="btn-secondary p-1 rounded-full w-9 h-9"
	onclick={toggle}
	aria-label="Toggle dark mode"
>
	<span class="i-carbon-sun dark:hidden text-lg"></span>
	<span class="i-carbon-moon hidden dark:inline text-lg"></span>
</button>
