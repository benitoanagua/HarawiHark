<script lang="ts">
	import 'uno.css';
	import favicon from '$lib/assets/favicon.svg';
	import Header from '$lib/components/layout/Header.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<script>
		document.documentElement.classList.toggle(
			'dark',
			localStorage.theme === 'dark' ||
				(!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
		);
	</script>
	<link rel="icon" href={favicon} />
</svelte:head>

<Header />

<main class="min-h-screen bg-gray-50 dark:bg-gray-900">
	{@render children?.()}
</main>

<Footer />
