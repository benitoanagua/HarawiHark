<script lang="ts">
	import { page } from '$app/stores';
	import { error } from '@sveltejs/kit';
	import { m } from '$lib/paraglide/messages.js';
	import type { Component } from 'svelte';

	const modules = import.meta.glob<{ default: Component; metadata?: { title?: string } }>(
		'/src/content/docs/**/*.md',
		{
			eager: true
		}
	);

	const slug = $page.params.slug || 'index';
	const file = `/src/content/docs/${slug}.md`;
	const match = modules[file];

	if (!match) error(404, 'Documentation page not found');

	// Extract metadata for page title
	const pageTitle = match.metadata?.title || slug.replace('/', ' / ');
</script>

<svelte:head>
	<title>{pageTitle} – HarawiHark</title>
	<meta name="description" content="{m.app_subtitle()} - {pageTitle}" />
</svelte:head>

<main class="min-h-screen bg-background">
	<div class="max-w-4xl mx-auto px-4 py-8">
		<!-- Breadcrumb Navigation -->
		<nav class="mb-8 not-prose">
			<div class="flex items-center gap-2 text-sm text-onSurfaceVariant">
				<a href="/" class="hover:text-onSurface transition-colors">
					{m.app_title()}
				</a>
				<span>•</span>
				<a href="/docs" class="hover:text-onSurface transition-colors">
					{m.nav_intro()}
				</a>
				{#if slug.includes('/')}
					{@const parts = slug.split('/')}
					{#each parts as part, index}
						<span>•</span>
						{#if index === parts.length - 1}
							<span class="text-onSurface capitalize">{part.replace('-', ' ')}</span>
						{:else}
							<span class="hover:text-onSurface transition-colors capitalize">
								{part.replace('-', ' ')}
							</span>
						{/if}
					{/each}
				{:else if slug !== 'index'}
					<span>•</span>
					<span class="text-onSurface capitalize">{slug.replace('-', ' ')}</span>
				{/if}
			</div>
		</nav>

		<!-- Main Content -->
		<article
			class="prose prose-lg max-w-none
			prose-headings:text-onSurface
			prose-p:text-onSurface
			prose-a:text-primary
			prose-strong:text-onSurface
			prose-code:text-primary
			prose-pre:bg-surfaceContainer
			prose-blockquote:border-primary
			prose-th:text-onSurface
			prose-td:text-onSurfaceVariant"
		>
			<svelte:component this={match.default} />
		</article>

		<!-- Back to Documentation with category context -->
		<div class="mt-12 pt-8 border-t border-outlineVariant not-prose">
			<div class="flex items-center justify-between">
				<a
					href="/docs"
					class="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
				>
					<span class="text-sm">←</span>
					{m.nav_intro()}
				</a>

				{#if slug.includes('/')}
					{@const category = slug.split('/')[0]}
					<div class="text-sm text-onSurfaceVariant">
						<span class="capitalize">{category.replace('-', ' ')}</span> section
					</div>
				{/if}
			</div>
		</div>
	</div>
</main>
