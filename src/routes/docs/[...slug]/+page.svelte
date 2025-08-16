<script lang="ts">
	import { page } from '$app/state';
	import { error } from '@sveltejs/kit';
	import type { Component } from 'svelte';

	const modules = import.meta.glob<{ default: Component }>('/src/content/docs/**/*.md', {
		eager: true
	});

	const slug = page.params.slug || 'index';
	const file = `/src/content/docs/${slug}.md`;

	const match = modules[file];
	if (!match) error(404);
</script>

<svelte:component this={match.default} />
