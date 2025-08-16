<script lang="ts">
	import 'uno.css';
	import favicon from '$lib/assets/favicon.svg';
	import { setLocale } from '$lib/paraglide/runtime';
	import { m } from '$lib/paraglide/messages.js';
	import { page } from '$app/state';

	let { children } = $props();
	const toggle = (lang: 'en' | 'es') => setLocale(lang);
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

<header class="sticky top-0 z-10 bg-gray-100 dark:bg-gray-800 px-4 py-2 shadow">
	<nav class="flex items-center gap-2">
		<span class="text-sm font-medium text-gray-700 dark:text-gray-300"
			>{m.language_switcher()}:</span
		>
		<button
			class="btn-secondary"
			class:ring-2={page.url.pathname.startsWith('/es')}
			onclick={() => toggle('es')}
		>
			🇪🇸 Español
		</button>
		<button
			class="btn-secondary"
			class:ring-2={!page.url.pathname.startsWith('/es')}
			onclick={() => toggle('en')}
		>
			🇺🇸 English
		</button>
	</nav>
</header>

<main class="min-h-screen bg-white dark:bg-gray-900">
	{@render children?.()}
</main>
