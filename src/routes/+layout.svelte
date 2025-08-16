<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import { setLocale } from '$lib/paraglide/runtime';
	import { m } from '$lib/paraglide/messages.js';
	import { page } from '$app/state';

	let { children } = $props();

	// helper for language toggle
	const toggle = (lang: 'en' | 'es') => setLocale(lang);
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<!-- LANGUAGE SWITCHER -->
<header>
	<nav>
		<span>{m.language_switcher()}:</span>
		<button
			class:active={page.url.pathname.startsWith('/es')}
			onclick={() => toggle('es')}
		>
			🇪🇸 Español
		</button>
		<button
			class:active={!page.url.pathname.startsWith('/es')}
			onclick={() => toggle('en')}
		>
			🇺🇸 English
		</button>
	</nav>
</header>

<!-- MAIN LAYOUT -->
<main>
	{@render children?.()}
</main>

<style>
	header {
		position: sticky;
		top: 0;
		background: #f3f4f6;
		padding: 0.5rem 1rem;
		display: flex;
		gap: 0.5rem;
		z-index: 10;
	}
	button.active {
		font-weight: bold;
		text-decoration: underline;
	}
	main {
		padding: 1rem;
	}
</style>