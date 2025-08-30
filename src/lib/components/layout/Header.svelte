<script lang="ts">
	import LanguageToggle from './LanguageToggle.svelte';
	import ThemeToggle from './ThemeToggle.svelte';
	import { m } from '$lib/paraglide/messages.js';
</script>

<header
	class="sticky top-0 z-10 bg-surface/80 backdrop-blur-sm border-b border-outlineVariant px-4 py-2"
>
	<nav class="max-w-4xl mx-auto flex items-center justify-between">
		<div class="flex items-center gap-4">
			<a href="/" class="font-bold text-lg text-onSurface">
				{m.app_title()}
			</a>

			<div class="hidden sm:flex items-center gap-2 text-sm">
				<a href="/docs" class="text-onSurfaceVariant hover:text-onSurface transition-colors">
					{m.nav_intro()}
				</a>
				<span class="text-outline">•</span>
				<a href="/api/check" class="text-onSurfaceVariant hover:text-onSurface transition-colors">
					{m.nav_api()}
				</a>
			</div>
		</div>

		<div class="flex items-center gap-3">
			<ThemeToggle />
			<LanguageToggle />
		</div>
	</nav>
</header>
