<script lang="ts">
	import { m } from '$lib/paraglide/messages.js';

	const modules = import.meta.glob<{ metadata: { title?: string } }>('/src/content/docs/**/*.md', {
		eager: true
	});

	const pages = Object.entries(modules).map(([path, mod]) => {
		const slug = path
			.replace('/src/content/docs/', '')
			.replace(/\+layout\.md$/, '')
			.replace(/\.md$/, '');
		return {
			href: `/docs/${slug}`.replace('/docs/index', '/docs'),
			title: mod.metadata?.title || slug.replace('/', ' / ')
		};
	});
</script>

<svelte:head>
	<title>HarawiHark – {m.language_switcher()}</title>
</svelte:head>

<main class="max-w-2xl mx-auto p-4 md:p-8">
	<h1 class="text-4xl font-bold mb-2 text-gray-900 dark:text-gray-100">HarawiHark</h1>
	<p class="mb-6 text-gray-700 dark:text-gray-300">{m.hello_world({ name: 'Poet' })}</p>

	<h2 class="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">{m.nav_intro()}</h2>
	<ul class="space-y-2">
		{#each pages as { href, title }}
			<li>
				<a
					{href}
					class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline"
				>
					{title}
				</a>
			</li>
		{/each}
	</ul>
</main>
