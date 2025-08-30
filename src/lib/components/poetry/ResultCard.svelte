<script lang="ts">
	import { m } from '$lib/paraglide/messages.js';
	import type { PoetryAnalysisResult } from '$lib/models/poetry.js';

	export let result: PoetryAnalysisResult;
</script>

<div
	class:bg-primaryContainer={result.ok}
	class:bg-errorContainer={!result.ok}
	class:border-outlineVariant={result.ok}
	class:border-error={!result.ok}
	class="mt-4 p-4 rounded-md border"
>
	{#each result.lines as line}
		<div class="flex items-start gap-2 mb-3">
			<!-- Columna izquierda: texto y sílabas -->
			<div class="flex-1">
				<p class="font-mono text-sm mb-1 text-onSurface">{line.text}</p>
				{#if line.syllables && line.syllables.length > 0}
					<div class="flex flex-wrap gap-1">
						{#each line.syllables as syllable}
							<span class="text-xs bg-surfaceVariant text-onSurfaceVariant px-1 py-0.5 rounded">
								{syllable}
							</span>
						{/each}
					</div>
				{/if}
			</div>

			<!-- Columna derecha: contador -->
			<span
				class="text-xs tabular-nums px-2 py-1 rounded min-w-[60px] text-center"
				class:text-onPrimaryContainer={line.count === line.expected}
				class:bg-primaryContainer={line.count === line.expected}
				class:text-onErrorContainer={line.count !== line.expected}
				class:bg-errorContainer={line.count !== line.expected}
			>
				{line.count}/{line.expected}
			</span>
		</div>
	{/each}

	<div class="mt-3 pt-2 border-t border-outlineVariant">
		<p
			class:text-onPrimaryContainer={result.ok}
			class:text-onErrorContainer={!result.ok}
			class="text-sm font-semibold flex items-center gap-2"
		>
			<span class="text-base">
				{result.ok ? '✅' : '❌'}
			</span>
			{result.ok ? m.pattern_matched() : m.pattern_mismatch()}
		</p>

		{#if result.summary}
			<p class="text-xs text-onSurfaceVariant mt-1">
				{result.summary}
			</p>
		{/if}
	</div>
</div>
