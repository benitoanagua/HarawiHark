<script lang="ts">
	import { SIMPLE_PATTERNS, getFormDescription, getExample } from '$lib/patterns';

	export let lines: string;
	export let form: string;

	$: currentLines = lines.split('\n').filter((line) => line.trim());
	$: pattern = SIMPLE_PATTERNS[form] || [];
	$: expectedLines = pattern.length;
	$: actualLines = currentLines.length;

	// Obtener ejemplo para el formulario actual
	function loadExample() {
		const locale = document.documentElement.lang || 'en';
		const example = getExample(form, locale as 'en' | 'es');
		if (example.length > 0) {
			lines = example.join('\n');
		}
	}

	// Limpiar textarea
	function clearText() {
		lines = '';
	}
</script>

<div class="space-y-3">
	<!-- Selector de forma -->
	<div>
		<label
			for="form-select"
			class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
		>
			Poetry Form
		</label>
		<select
			id="form-select"
			class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm"
			bind:value={form}
		>
			<option value="haiku">Haiku (5-7-5)</option>
			<option value="tanka">Tanka (5-7-5-7-7)</option>
			<option value="cinquain">Cinquain (2-4-6-8-2)</option>
			<option value="limerick">Limerick (8-8-5-5-8)</option>
			<option value="redondilla">Redondilla (8-8-8-8)</option>
			<option value="romance">Romance (8×8)</option>
			<option value="diamante">Diamante (1-2-3-4-3-2-1)</option>
			<option value="fib">Fibonacci (1-1-2-3-5-8)</option>
		</select>
	</div>

	<!-- Información del patrón -->
	{#if pattern.length > 0}
		<div
			class="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md border border-blue-200 dark:border-blue-800"
		>
			<div class="flex items-center justify-between mb-1">
				<h3 class="font-medium text-blue-900 dark:text-blue-100 capitalize">{form}</h3>
				<span class="text-xs text-blue-700 dark:text-blue-300">
					{actualLines}/{expectedLines} lines
				</span>
			</div>
			<p class="text-sm text-blue-800 dark:text-blue-200 mb-2">
				Pattern: {pattern.join('-')} syllables
			</p>
			<p class="text-xs text-blue-700 dark:text-blue-300">
				{getFormDescription(form, 'en')}
			</p>
		</div>
	{/if}

	<!-- Textarea principal -->
	<div class="relative">
		<label for="poem-text" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
			Your Poem
		</label>
		<textarea
			id="poem-text"
			class="w-full h-40 p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm resize-none font-mono"
			bind:value={lines}
			placeholder="Write each line on a new line...&#10;&#10;For example:&#10;An old silent pond&#10;A frog jumps into the pond—&#10;Splash! Silence again."
		></textarea>

		<!-- Contador de líneas en vivo -->
		<div class="absolute bottom-2 right-2 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs">
			<span
				class:text-green-600={actualLines === expectedLines}
				class:text-red-600={actualLines !== expectedLines}
				class:text-gray-600={actualLines === 0}
			>
				{actualLines} lines
			</span>
		</div>
	</div>

	<!-- Botones de utilidad -->
	<div class="flex gap-2">
		<button
			type="button"
			class="btn-secondary text-xs"
			onclick={loadExample}
			title="Load example poem"
		>
			📝 Example
		</button>

		<button type="button" class="btn-secondary text-xs" onclick={clearText} title="Clear text">
			🗑️ Clear
		</button>

		<div class="flex-1"></div>

		<!-- Info de patrones por línea -->
		{#if currentLines.length > 0 && pattern.length > 0}
			<div class="text-xs text-gray-500 dark:text-gray-400 flex items-center">
				Expected:
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
