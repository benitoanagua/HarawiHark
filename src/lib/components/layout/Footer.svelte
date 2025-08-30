<script lang="ts">
	import { m } from '$lib/paraglide/messages.js';
</script>

<footer class="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-auto">
	<div class="max-w-4xl mx-auto px-4 py-6">
		<div class="flex flex-col sm:flex-row items-center justify-between gap-4">
			<p class="text-sm text-gray-600 dark:text-gray-400">
				© 2024 HarawiHark. {m.powered_by()} SvelteKit & ParaglideJS
			</p>

			<div class="flex items-center gap-4 text-sm">
				<a
					href="/docs"
					class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
				>
					{m.documentation()}
				</a>
				<a
					href="/api/check"
					class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
				>
					API
				</a>
			</div>
		</div>
	</div>
</footer>
