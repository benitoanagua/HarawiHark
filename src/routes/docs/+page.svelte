<script lang="ts">
	import { m } from '$lib/paraglide/messages.js';

	const modules = import.meta.glob<{ metadata: { title?: string; description?: string } }>(
		'/src/content/docs/**/*.md',
		{
			eager: true
		}
	);

	// Organizar páginas por categorías
	const allPages = Object.entries(modules)
		.map(([path, mod]) => {
			const slug = path
				.replace('/src/content/docs/', '')
				.replace(/\+layout\.md$/, '')
				.replace(/\.md$/, '');

			const parts = slug.split('/');
			const category = parts.length > 1 ? parts[0] : 'root';
			const name = parts.length > 1 ? parts[1] : parts[0];

			return {
				href: `/docs/${slug}`,
				title: mod.metadata?.title || name.replace('-', ' '),
				description: mod.metadata?.description || '',
				slug,
				category,
				name,
				isRoot: parts.length === 1
			};
		})
		.filter((page) => page.slug !== 'index' && !page.slug.includes('+layout'));

	// Separar por categorías
	const rootPages = allPages.filter((p) => p.isRoot).sort((a, b) => a.title.localeCompare(b.title));
	const formsPages = allPages
		.filter((p) => p.category === 'forms')
		.sort((a, b) => a.title.localeCompare(b.title));
	const guidesPages = allPages
		.filter((p) => p.category === 'guides')
		.sort((a, b) => a.title.localeCompare(b.title));
	const apiPages = allPages
		.filter((p) => p.category === 'api')
		.sort((a, b) => a.title.localeCompare(b.title));

	const categories = [
		{ name: 'Getting Started', icon: '🚀', pages: rootPages, id: 'root' },
		{ name: 'Poetry Forms', icon: '📝', pages: formsPages, id: 'forms' },
		{ name: 'Guides', icon: '📖', pages: guidesPages, id: 'guides' },
		{ name: 'API Reference', icon: '⚙️', pages: apiPages, id: 'api' }
	].filter((cat) => cat.pages.length > 0);
</script>

<svelte:head>
	<title>HarawiHark – {m.nav_intro()}</title>
	<meta name="description" content="{m.app_subtitle()} - {m.nav_intro()}" />
</svelte:head>

<main class="min-h-screen bg-background">
	<div class="max-w-4xl mx-auto px-4 py-8">
		<!-- Header Section -->
		<div class="text-center mb-12">
			<h1 class="text-5xl font-bold mb-4 text-onSurface">
				{m.app_title()}
			</h1>
			<p class="text-xl text-onSurfaceVariant mb-2">
				{m.app_subtitle()}
			</p>
			<p class="text-lg text-onSurface">
				{m.hello_world({ name: 'Poet' })}
			</p>
		</div>

		<!-- Quick Start Section -->
		<div class="bg-surface rounded-lg shadow-sm border border-outlineVariant p-6 mb-8">
			<h2 class="text-2xl font-semibold mb-4 text-onSurface flex items-center gap-2">
				<span class="text-2xl">🚀</span>
				Quick Start
			</h2>
			<div class="grid md:grid-cols-2 gap-6">
				<div>
					<h3 class="font-medium text-onSurface mb-2">Try the Analyzer</h3>
					<p class="text-sm text-onSurfaceVariant mb-3">
						Start analyzing poetry right away with our interactive tool.
					</p>
					<a
						href="/"
						class="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-onPrimary px-4 py-2 rounded-md transition-colors text-sm font-medium"
					>
						<span>✨</span>
						Analyze Poetry
					</a>
				</div>
				<div>
					<h3 class="font-medium text-onSurface mb-2">API Access</h3>
					<p class="text-sm text-onSurfaceVariant mb-3">
						Integrate poetry analysis into your own applications.
					</p>
					<a
						href="/api/check"
						class="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/90 text-onSecondary px-4 py-2 rounded-md transition-colors text-sm font-medium"
					>
						<span>🔧</span>
						{m.nav_api()}
					</a>
				</div>
			</div>
		</div>

		<!-- Documentation Section -->
		<section class="mb-12">
			<h2 class="text-3xl font-bold mb-8 text-onSurface flex items-center gap-2">
				<span class="text-2xl">📚</span>
				{m.nav_intro()}
			</h2>

			{#if categories.length > 0}
				<div class="space-y-8">
					{#each categories as { name, icon, pages, id }}
						<div class="border border-outlineVariant rounded-lg overflow-hidden">
							<div class="bg-surfaceContainer px-6 py-4 border-b border-outlineVariant">
								<h3 class="text-xl font-semibold text-onSurface flex items-center gap-2">
									<span class="text-xl">{icon}</span>
									{name}
									<span class="text-sm text-onSurfaceVariant font-normal">({pages.length})</span>
								</h3>
							</div>

							<div class="bg-surface">
								{#each pages as { href, title, description }, index}
									<div
										class="px-6 py-4 {index < pages.length - 1
											? 'border-b border-outlineVariant'
											: ''} hover:bg-surfaceContainer transition-colors"
									>
										<h4 class="font-medium mb-1">
											<a
												{href}
												class="text-onSurface hover:text-primary transition-colors capitalize"
											>
												{title}
											</a>
										</h4>
										{#if description}
											<p class="text-onSurfaceVariant text-sm mb-2">
												{description}
											</p>
										{/if}
										<a
											{href}
											class="text-primary hover:text-primary/80 text-sm font-medium inline-flex items-center gap-1 transition-colors"
										>
											Read more
											<span class="text-xs">→</span>
										</a>
									</div>
								{/each}
							</div>
						</div>
					{/each}
				</div>
			{:else}
				<div class="bg-surfaceContainer rounded-lg p-8 text-center">
					<div class="text-4xl mb-4">📝</div>
					<h3 class="text-lg font-medium text-onSurface mb-2">Documentation Coming Soon</h3>
					<p class="text-onSurfaceVariant">
						We're working on comprehensive documentation. Check back soon!
					</p>
				</div>
			{/if}
		</section>

		<!-- Features Section -->
		<section class="grid md:grid-cols-3 gap-6">
			<div class="bg-surface rounded-lg shadow-sm border border-outlineVariant p-6">
				<div class="text-3xl mb-3">🌍</div>
				<h3 class="font-semibold text-onSurface mb-2">Multilingual</h3>
				<p class="text-sm text-onSurfaceVariant">
					Support for English and Spanish poetry analysis with accurate syllable counting.
				</p>
			</div>

			<div class="bg-surface rounded-lg shadow-sm border border-outlineVariant p-6">
				<div class="text-3xl mb-3">📊</div>
				<h3 class="font-semibold text-onSurface mb-2">Pattern Analysis</h3>
				<p class="text-sm text-onSurfaceVariant">
					Analyze various poetry forms including haiku, tanka, sonnets, and more.
				</p>
			</div>

			<div class="bg-surface rounded-lg shadow-sm border border-outlineVariant p-6">
				<div class="text-3xl mb-3">🎯</div>
				<h3 class="font-semibold text-onSurface mb-2">Precise Results</h3>
				<p class="text-sm text-onSurfaceVariant">
					Get detailed syllable breakdowns and pattern matching validation.
				</p>
			</div>
		</section>
	</div>
</main>
