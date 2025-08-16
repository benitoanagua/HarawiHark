<script>
	import { m } from '$lib/paraglide/messages.js';
</script>

<aside>
	<nav>
		<a href="/docs">{m.nav_intro()}</a>
		<a href="/docs/forms">{m.nav_forms()}</a>
		<a href="/docs/api/check">{m.nav_api()}</a>
		<a href="/docs/guides">{m.nav_guides()}</a>
		<a href="/docs/faq">{m.nav_faq()}</a>
	</nav>
</aside>

<main>
	<slot />
</main>

<style>
	aside {
		width: 12rem;
		background: #f3f4f6;
		padding: 1rem;
	}
	main {
		flex: 1;
		padding: 2rem;
	}
</style>