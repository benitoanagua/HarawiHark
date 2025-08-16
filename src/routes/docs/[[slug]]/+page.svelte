<script lang="ts">
  import { page } from '$app/state';
  import { error } from '@sveltejs/kit';
  import type { ComponentType, SvelteComponent } from 'svelte';

  const modules = import.meta.glob<{
    default: ComponentType<SvelteComponent>;
  }>('/src/content/docs/**/*.md', { eager: true });

  // slug can be '' (for /docs), 'forms/haiku', 'guides/spanish-rules', etc.
  const slug = page.params.slug?.replace(/\/$/, '') || 'index';
  const file = `/src/content/docs/${slug}.md`;

  const match = modules[file];
  if (!match) error(404, `${file} not found`);
</script>

<svelte:component this={match.default} />