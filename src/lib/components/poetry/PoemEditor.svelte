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

<div class="space-y-4">
	<!-- Form Selector -->
	<div>
		<label for="form-select" class="block text-sm font-medium text-onSurface mb-2">
			{m.poetry_form()}
		</label>
		<select id="form-select" class="input-outlined w-full" bind:value={form}>
			{#each Object.keys(POETRY_FORMS) as formKey}
				<option value={formKey}>{getFormName(formKey)}</option>
			{/each}
		</select>
	</div>

	<!-- Pattern Info - Con mejor visual pero estructura simple -->
	{#if pattern.length > 0}
		<div class="bg-primaryContainer p-4 rounded-xl border border-outlineVariant">
			<div class="flex items-center gap-2 mb-2">
				<div class="w-2 h-2 bg-primary rounded-full"></div>
				<h3 class="font-medium text-onPrimaryContainer">{getFormName(form)}</h3>
			</div>
			<p class="text-sm text-onPrimaryContainer mb-1">
				<span class="font-medium">Pattern:</span>
				<span class="bg-primary/20 px-2 py-1 rounded text-xs font-mono ml-1">
					{pattern.join('-')} syllables
				</span>
			</p>
			<p class="text-xs text-onPrimaryContainer/80 leading-relaxed">{getFormDescription(form)}</p>
		</div>
	{/if}

	<!-- Poem Input - Mejorado pero sin complicar -->
	<div>
		<label for="poem-text" class="block text-sm font-medium text-onSurface mb-2">
			{m.your_poem()}
		</label>
		<textarea
			id="poem-text"
			class="w-full h-40 p-4 border border-outline rounded-xl bg-surfaceContainer
				   text-onSurface text-sm resize-none font-mono leading-relaxed
				   focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20
				   placeholder:text-onSurfaceVariant transition-all duration-200"
			bind:value={lines}
			placeholder={currentLocale === 'es'
				? 'Escribe cada verso en una línea nueva...\n\nEjemplo:\nFlores de cerezo\nDanzan en la brisa tibia\nPrimavera llega'
				: 'Write each line on a new line...\n\nExample:\nCherry blossoms fall\nDancing in the gentle breeze\nSpring has finally come'}
		></textarea>

		<!-- Pequeño contador útil -->
		<div class="flex justify-between text-xs text-onSurfaceVariant mt-1">
			<span>{currentLines.length} lines</span>
			<span>{lines.length} characters</span>
		</div>
	</div>

	<!-- Action Buttons - Con iconos pero simple -->
	<div class="flex gap-3">
		<button type="button" class="btn-secondary flex items-center gap-2" onclick={loadExample}>
			<span class="i-carbon:document-download text-xl"></span>
			{m.load_example()}
		</button>
		<button type="button" class="btn-text flex items-center gap-2" onclick={clearText}>
			<span class="i-carbon:clean text-xl"></span>
			{m.clear_text()}
		</button>
	</div>
</div>
