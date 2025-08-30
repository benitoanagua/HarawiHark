<script>
	import { m } from '$lib/paraglide/messages.js';
</script>

<div class="flex min-h-screen">
	<aside class="w-48 bg-surfaceContainer p-4 space-y-3">
		<nav class="space-y-2">
			{#each [{ href: '/docs', label: m.nav_intro() }, { href: '/docs/forms', label: m.nav_forms() }, { href: '/docs/api/check', label: m.nav_api() }, { href: '/docs/guides', label: m.nav_guides() }, { href: '/docs/faq', label: m.nav_faq() }] as { href, label }}
				<a {href} class="block text-sm text-onSurfaceVariant hover:text-primary transition-colors">
					{label}
				</a>
			{/each}
		</nav>
	</aside>

	<main class="flex-1 p-4 md:p-6 max-w-4xl bg-background">
		<slot />
	</main>
</div>
