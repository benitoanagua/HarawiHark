<script lang="ts">
	import { m } from '$lib/paraglide/messages.js';
	import { POETRY_FORMS } from '$lib/data/poetry-forms.js';
	import {
		getFormName,
		getFormDescription,
		getFormExample,
		getCurrentLocale
	} from '$lib/services/i18n.js';

	export let lines: string = '';
	export let form: string = 'haiku';

	$: currentLines = lines.split('\n').filter((line) => line.trim());
	$: pattern = POETRY_FORMS[form]?.pattern || [];
	$: currentLocale = getCurrentLocale();

	const loadExample = () => {
		const example = getFormExample(form);
		if (example.length) lines = example.join('\n');
	};

	const clearText = () => (lines = '');
</script>

<div class="space-y-3">
	<!-- Form Selector -->
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
			{#each Object.keys(POETRY_FORMS) as formKey}
				<option value={formKey}>{getFormName(formKey)}</option>
			{/each}
		</select>
	</div>

	<!-- Pattern Info -->
	{#if pattern.length > 0}
		<div
			class="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md border border-blue-200 dark:border-blue-800"
		>
			<h3 class="font-medium text-blue-900 dark:text-blue-100">{getFormName(form)}</h3>
			<p class="text-sm text-blue-800 dark:text-blue-200 mb-1">
				Pattern: {pattern.join('-')} syllables
			</p>
			<p class="text-xs text-blue-700 dark:text-blue-300">{getFormDescription(form)}</p>
		</div>
	{/if}

	<!-- Poem Input -->
	<div>
		<label for="poem-text" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
			{m.your_poem()}
		</label>
		<textarea
			id="poem-text"
			class="w-full h-40 p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm resize-none font-mono"
			bind:value={lines}
			placeholder={currentLocale === 'es'
				? 'Escribe cada verso en una línea nueva...'
				: 'Write each line on a new line...'}
		></textarea>
	</div>

	<!-- Action Buttons -->
	<div class="flex gap-2">
		<button type="button" class="btn-secondary text-xs" onclick={loadExample}>
			{m.load_example()}
		</button>
		<button type="button" class="btn-secondary text-xs" onclick={clearText}>
			{m.clear_text()}
		</button>
	</div>
</div>
