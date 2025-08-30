<script lang="ts">
	import { m } from '$lib/paraglide/messages.js';
</script>

<footer class="bg-surface border-t border-outlineVariant mt-auto">
	<div class="max-w-4xl mx-auto px-4 py-6">
		<div class="flex flex-col sm:flex-row items-center justify-between gap-4">
			<p class="text-sm text-onSurfaceVariant">
				© 2024 HarawiHark. {m.powered_by()} SvelteKit & ParaglideJS
			</p>

			<div class="flex items-center gap-4 text-sm">
				<a href="/docs" class="text-onSurfaceVariant hover:text-onSurface transition-colors">
					{m.documentation()}
				</a>
				<a href="/api/check" class="text-onSurfaceVariant hover:text-onSurface transition-colors">
					API
				</a>
			</div>
		</div>
	</div>
</footer>
