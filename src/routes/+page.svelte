<script lang="ts">
	import { m } from '$lib/paraglide/messages.js';

	// vite glob import → array of all .md files
	const modules = import.meta.glob<{
		metadata: { title?: string };
	}>('/src/content/docs/**/*.md', { eager: true });

	const pages = Object.entries(modules).map(([path, mod]) => {
		const slug = path
			.replace('/src/content/docs/', '')
			.replace(/\+layout\.md$/, '') // ignore layout files
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

<h1>HarawiHark</h1>
<p>{m.hello_world({ name: 'Poet' })}</p>

<h2>{m.nav_intro()}</h2>
<ul>
	{#each pages as { href, title }}
		<li><a {href}>{title}</a></li>
	{/each}
</ul>