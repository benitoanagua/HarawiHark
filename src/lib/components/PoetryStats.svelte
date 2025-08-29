<script lang="ts">
	import { m } from '$lib/paraglide/messages.js';
	import { getLocale } from '$lib/paraglide/runtime'; // Cambiado de Locale a getLocale

	export let result: {
		lines: Array<{ count: number; expected: number; match: boolean }>;
		form: string;
		ok: boolean;
	};

	$: totalSyllables = result.lines.reduce((sum, line) => sum + line.count, 0);
	$: expectedSyllables = result.lines.reduce((sum, line) => sum + line.expected, 0);
	$: matchedLines = result.lines.filter((line) => line.match).length;
	$: accuracy = result.lines.length > 0 ? (matchedLines / result.lines.length) * 100 : 0;
	$: currentLocale = getLocale(); // Cambiado de Locale() a getLocale()
</script>

/// src/lib/components/PoetryStats.svelte

<div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border">
	<h3 class="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-3">
		{currentLocale === 'es' ? 'Estadísticas del Poema' : 'Poem Statistics'}
	</h3>

	<div class="grid grid-cols-2 gap-4 text-sm">
		<div class="text-center p-2 bg-white dark:bg-gray-700 rounded">
			<div class="text-lg font-bold text-blue-600 dark:text-blue-400">
				{totalSyllables}
			</div>
			<div class="text-xs text-gray-600 dark:text-gray-400">
				{currentLocale === 'es' ? 'Sílabas totales' : 'Total syllables'}
			</div>
		</div>

		<div class="text-center p-2 bg-white dark:bg-gray-700 rounded">
			<div class="text-lg font-bold text-green-600 dark:text-green-400">
				{matchedLines}/{result.lines.length}
			</div>
			<div class="text-xs text-gray-600 dark:text-gray-400">
				{currentLocale === 'es' ? 'Líneas correctas' : 'Correct lines'}
			</div>
		</div>

		<div class="text-center p-2 bg-white dark:bg-gray-700 rounded">
			<div
				class="text-lg font-bold"
				class:text-green-600={accuracy === 100}
				class:text-yellow-600={accuracy >= 70 && accuracy < 100}
				class:text-red-600={accuracy < 70}
			>
				{accuracy.toFixed(0)}%
			</div>
			<div class="text-xs text-gray-600 dark:text-gray-400">
				{currentLocale === 'es' ? 'Precisión' : 'Accuracy'}
			</div>
		</div>

		<div class="text-center p-2 bg-white dark:bg-gray-700 rounded">
			<div class="text-lg font-bold text-purple-600 dark:text-purple-400">
				{result.form.toUpperCase()}
			</div>
			<div class="text-xs text-gray-600 dark:text-gray-400">
				{currentLocale === 'es' ? 'Forma' : 'Form'}
			</div>
		</div>
	</div>
</div>
