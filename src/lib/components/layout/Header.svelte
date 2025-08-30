<script lang="ts">
	import LanguageToggle from './LanguageToggle.svelte';
	import ThemeToggle from './ThemeToggle.svelte';
	import { m } from '$lib/paraglide/messages.js';
</script>

<header class="sticky top-0 z-10 bg-surface/95 backdrop-blur-sm border-b border-outlineVariant">
	<div class="max-w-4xl mx-auto px-4 py-3">
		<nav class="flex items-center justify-between">
			<!-- Logo and Navigation -->
			<div class="flex items-center gap-6">
				<a
					href="/"
					class="font-bold text-xl text-onSurface hover:text-primary transition-colors duration-200"
				>
					{m.app_title()}
				</a>

				<div class="hidden sm:flex items-center gap-1">
					<a
						href="/docs"
						class="nav-item px-4 py-2 text-sm font-medium rounded-full
							   text-onSurfaceVariant hover:bg-secondaryContainer
							   hover:text-onSecondaryContainer transition-all duration-200"
					>
						{m.nav_intro()}
					</a>
					<span class="text-outline mx-1">•</span>
					<a
						href="/api/check"
						class="nav-item px-4 py-2 text-sm font-medium rounded-full
							   text-onSurfaceVariant hover:bg-secondaryContainer
							   hover:text-onSecondaryContainer transition-all duration-200"
					>
						{m.nav_api()}
					</a>
				</div>
			</div>

			<!-- Controls -->
			<div class="flex items-center gap-2">
				<ThemeToggle />
				<LanguageToggle />
			</div>
		</nav>
	</div>
</header>
