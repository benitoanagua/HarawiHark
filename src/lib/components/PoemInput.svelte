<script lang="ts">
	import { SIMPLE_PATTERNS, getFormDescription, getFormName, getExample } from '$lib/patterns';
	import { m } from '$lib/paraglide/messages.js';
	import { getLocale } from '$lib/paraglide/runtime'; // Cambiado de Locale a getLocale

	export let lines: string;
	export let form: string;

	$: currentLines = lines.split('\n').filter((line) => line.trim());
	$: pattern = SIMPLE_PATTERNS[form] || [];
	$: expectedLines = pattern.length;
	$: actualLines = currentLines.length;
	$: currentLocale = getLocale(); // Cambiado de Locale() a getLocale()

	function loadExample() {
		const example = getExample(form, currentLocale);
		if (example.length > 0) {
			lines = example.join('\n');
		}
	}

	function clearText() {
		lines = '';
	}

	// Placeholder dinámico según el idioma y forma
	$: placeholderText =
		currentLocale === 'es'
			? `Escribe cada verso en una línea nueva...\n\n${getExample(form, 'es').slice(0, 3).join('\n') || 'Por ejemplo:\nViejo estanque\nUna rana salta al agua'}`
			: `Write each line on a new line...\n\n${getExample(form, 'en').slice(0, 3).join('\n') || 'For example:\nAn old silent pond\nA frog jumps into the pond—'}`;
</script>

<div class="space-y-3">
	<!-- Selector de forma mejorado -->
	<div>
		<label
			for="form-select"
			class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
		>
			{m.poetry_form()}
		</label>
		<select
			id="form-select"
			class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm"
			bind:value={form}
		>
			{#each Object.keys(SIMPLE_PATTERNS) as formKey}
				<option value={formKey}>
					{getFormName(formKey)} ({SIMPLE_PATTERNS[formKey].join('-')})
				</option>
			{/each}
		</select>
	</div>

	<!-- Información del patrón mejorada -->
	{#if pattern.length > 0}
		<div
			class="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md border border-blue-200 dark:border-blue-800"
		>
			<div class="flex items-center justify-between mb-1">
				<h3 class="font-medium text-blue-900 dark:text-blue-100">
					{getFormName(form)}
				</h3>
				<span class="text-xs text-blue-700 dark:text-blue-300">
					{m.lines_count({ count: actualLines })}/{expectedLines}
				</span>
			</div>
			<p class="text-sm text-blue-800 dark:text-blue-200 mb-2">
				{currentLocale === 'es' ? 'Patrón' : 'Pattern'}: {pattern.join('-')}
				{currentLocale === 'es' ? 'sílabas' : 'syllables'}
			</p>
			<p class="text-xs text-blue-700 dark:text-blue-300">
				{getFormDescription(form)}
			</p>
		</div>
	{/if}

	<!-- Textarea principal mejorado -->
	<div class="relative">
		<label for="poem-text" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
			{m.your_poem()}
		</label>
		<textarea
			id="poem-text"
			class="w-full h-40 p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm resize-none font-mono"
			bind:value={lines}
			placeholder={placeholderText}
		></textarea>

		<!-- Contador de líneas mejorado -->
		<div class="absolute bottom-2 right-2 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs">
			<span
				class:text-green-600={actualLines === expectedLines}
				class:text-red-600={actualLines !== expectedLines}
				class:text-gray-600={actualLines === 0}
			>
				{m.lines_count({ count: actualLines })}
			</span>
		</div>
	</div>

	<!-- Botones de utilidad mejorados -->
	<div class="flex gap-2">
		<button
			type="button"
			class="btn-secondary text-xs"
			onclick={loadExample}
			title={currentLocale === 'es' ? 'Cargar poema de ejemplo' : 'Load example poem'}
		>
			📝 {m.load_example()}
		</button>

		<button
			type="button"
			class="btn-secondary text-xs"
			onclick={clearText}
			title={currentLocale === 'es' ? 'Limpiar texto' : 'Clear text'}
		>
			🗑️ {m.clear_text()}
		</button>

		<div class="flex-1"></div>

		<!-- Info de patrones por línea mejorada -->
		{#if currentLines.length > 0 && pattern.length > 0}
			<div class="text-xs text-gray-500 dark:text-gray-400 flex items-center">
				{m.expected_pattern()}:
				{#each pattern.slice(0, Math.max(currentLines.length, pattern.length)) as syllables, i}
					<span
						class="ml-1 px-1 py-0.5 rounded bg-gray-200 dark:bg-gray-600"
						class:bg-green-200={i < currentLines.length}
						class:dark:bg-green-800={i < currentLines.length}
					>
						{syllables}
					</span>
				{/each}
			</div>
		{/if}
	</div>
</div>
