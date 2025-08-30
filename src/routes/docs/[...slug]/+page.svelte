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

<main class="min-h-screen bg-gray-50 dark:bg-gray-900">
	<div class="max-w-4xl mx-auto px-4 py-8">
		<!-- Breadcrumb Navigation -->
		<nav class="mb-8 not-prose">
			<div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
				<a href="/" class="hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
					{m.app_title()}
				</a>
				<span>•</span>
				<a href="/docs" class="hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
					{m.nav_intro()}
				</a>
				{#if slug.includes('/')}
					{@const parts = slug.split('/')}
					{#each parts as part, index}
						<span>•</span>
						{#if index === parts.length - 1}
							<span class="text-gray-900 dark:text-gray-100 capitalize"
								>{part.replace('-', ' ')}</span
							>
						{:else}
							<span
								class="hover:text-gray-900 dark:hover:text-gray-100 transition-colors capitalize"
							>
								{part.replace('-', ' ')}
							</span>
						{/if}
					{/each}
				{:else if slug !== 'index'}
					<span>•</span>
					<span class="text-gray-900 dark:text-gray-100 capitalize">{slug.replace('-', ' ')}</span>
				{/if}
			</div>
		</nav>

		<!-- Main Content -->
		<article
			class="prose dark:prose-invert prose-lg max-w-none
			prose-headings:text-gray-900 dark:prose-headings:text-gray-100
			prose-p:text-gray-700 dark:prose-p:text-gray-300
			prose-a:text-blue-600 dark:prose-a:text-blue-400
			prose-strong:text-gray-900 dark:prose-strong:text-gray-100
			prose-code:text-blue-600 dark:prose-code:text-blue-400
			prose-pre:bg-gray-100 dark:prose-pre:bg-gray-800
			prose-blockquote:border-blue-500
			prose-th:text-gray-900 dark:prose-th:text-gray-100
			prose-td:text-gray-700 dark:prose-td:text-gray-300"
		>
			<svelte:component this={match.default} />
		</article>

		<!-- Back to Documentation with category context -->
		<div class="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700 not-prose">
			<div class="flex items-center justify-between">
				<a
					href="/docs"
					class="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
				>
					<span class="text-sm">←</span>
					{m.nav_intro()}
				</a>

				{#if slug.includes('/')}
					{@const category = slug.split('/')[0]}
					<div class="text-sm text-gray-500 dark:text-gray-400">
						<span class="capitalize">{category.replace('-', ' ')}</span> section
					</div>
				{/if}
			</div>
		</div>
	</div>
</main>
