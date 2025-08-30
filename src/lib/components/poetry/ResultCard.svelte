<script lang="ts">
	import { m } from '$lib/paraglide/messages.js';
	import type { PoetryAnalysisResult } from '$lib/models/poetry.js';

	export let result: PoetryAnalysisResult;
</script>

<div
	class="mt-6 rounded-xl border shadow-sm"
	class:bg-primaryContainer={result.ok}
	class:bg-errorContainer={!result.ok}
	class:border-primary={result.ok}
	class:border-error={!result.ok}
>
	<!-- Header con estado -->
	<div class="p-4 border-b border-outlineVariant flex items-center gap-3">
		<div
			class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
			class:bg-primary={result.ok}
			class:bg-error={!result.ok}
		>
			<span class="text-lg">
				{result.ok ? '✅' : '❌'}
			</span>
		</div>
		<div class="flex-1 min-w-0">
			<h3
				class="font-semibold text-base"
				class:text-onPrimaryContainer={result.ok}
				class:text-onErrorContainer={!result.ok}
			>
				{result.ok ? m.pattern_matched() : m.pattern_mismatch()}
			</h3>
			{#if result.summary}
				<p class="text-xs text-onSurfaceVariant mt-0.5">
					{result.summary}
				</p>
			{/if}
		</div>
	</div>

	<!-- Analysis Results -->
	<div class="p-4 space-y-3">
		{#each result.lines as line, index}
			<div class="flex items-start gap-3 p-3 bg-surface rounded-lg border border-outlineVariant">
				<!-- Contenido de la línea -->
				<div class="flex-1 min-w-0">
					<div class="text-xs text-onSurfaceVariant mb-1">Line {index + 1}</div>
					<p class="font-mono text-sm text-onSurface mb-2 break-words">"{line.text}"</p>

					<!-- Breakdown de sílabas -->
					{#if line.syllables && line.syllables.length > 0}
						<div class="flex flex-wrap gap-1">
							{#each line.syllables as syllable}
								<span
									class="text-xs px-2 py-1 rounded font-medium"
									class:bg-primaryContainer={line.count === line.expected}
									class:text-onPrimaryContainer={line.count === line.expected}
									class:bg-errorContainer={line.count !== line.expected}
									class:text-onErrorContainer={line.count !== line.expected}
								>
									{syllable}
								</span>
							{/each}
						</div>
					{/if}
				</div>

				<!-- Contador -->
				<div
					class="w-14 h-14 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
					class:bg-primary={line.count === line.expected}
					class:text-onPrimary={line.count === line.expected}
					class:bg-error={line.count !== line.expected}
					class:text-onError={line.count !== line.expected}
				>
					<div class="text-lg leading-none">{line.count}</div>
					<div class="text-lg opacity-80">/{line.expected}</div>
				</div>
			</div>
		{/each}
	</div>

	<!-- Footer con estadísticas -->
	{#if result.lines}
		{@const correctLines = result.lines.filter((line) => line.count === line.expected).length}
		<div
			class="px-4 py-3 bg-surfaceContainer rounded-b-xl flex items-center justify-between text-sm"
		>
			<span class="text-onSurfaceVariant">
				Analysis completed • {result.lines.length} lines processed
			</span>
			<span class="font-medium text-onSurface">
				{correctLines}/{result.lines.length} correct
			</span>
		</div>
	{/if}
</div>
