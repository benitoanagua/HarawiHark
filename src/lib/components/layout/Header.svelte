<script lang="ts">
	import { m } from '$lib/paraglide/messages.js';
	import LanguageToggle from './LanguageToggle.svelte';
</script>

<header
	class="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 px-4 py-2"
>
	<nav class="max-w-4xl mx-auto flex items-center justify-between">
		<div class="flex items-center gap-4">
			<a href="/" class="font-bold text-lg text-gray-900 dark:text-gray-100">
				{m.app_title()}
			</a>

			<div class="hidden sm:flex items-center gap-2 text-sm">
				<a
					href="/docs"
					class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
				>
					{m.nav_intro()}
				</a>
				<span class="text-gray-400">•</span>
				<a
					href="/api/check"
					class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
				>
					{m.nav_api()}
				</a>
			</div>
		</div>

		<LanguageToggle />
	</nav>
</header>
