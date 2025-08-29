<script lang="ts">
	import { m } from '$lib/paraglide/messages.js';
	import { getLocale } from '$lib/paraglide/runtime';
	import { getFormDescription, getFormName } from '$lib/patterns';

	export let form: string;
	export let showTips = false;

	$: currentLocale = getLocale();

	// Definir tipos para las claves válidas
	type TipKey =
		| 'haiku'
		| 'tanka'
		| 'limerick'
		| 'redondilla'
		| 'cinquain'
		| 'lanterne'
		| 'diamante'
		| 'fib';

	const tips: Record<'en' | 'es', Partial<Record<TipKey, string>>> = {
		en: {
			haiku: 'Focus on nature imagery and present moment. Each line should be a complete thought.',
			tanka: 'Traditional court poetry. Often expresses emotions or tells a story.',
			limerick: 'Humorous poems with AABBA rhyme scheme. Line 5 often mirrors line 1.',
			redondilla: 'Spanish verse form. Focus on octosyllabic meter (8 syllables per line).',
			cinquain: 'American imagist form with crescendo shape. Builds intensity then resolves.',
			lanterne: 'Japanese-inspired lantern shape. Creates visual and syllabic symmetry.',
			diamante: 'Diamond-shaped contrast poem. First and last lines are opposites.',
			fib: 'Based on Fibonacci sequence. Each line syllable count follows the sequence.'
		},
		es: {
			haiku:
				'Enfócate en imágenes de la naturaleza y el momento presente. Cada línea debe ser un pensamiento completo.',
			tanka: 'Poesía cortesana tradicional. A menudo expresa emociones o cuenta una historia.',
			limerick:
				'Poemas humorísticos con esquema de rima AABBA. La línea 5 a menudo refleja la línea 1.',
			redondilla: 'Forma de verso española. Enfócate en el metro octosílabo (8 sílabas por línea).',
			cinquain:
				'Forma imaginista americana con forma de crescendo. Construye intensidad y luego se resuelve.',
			lanterne: 'Forma de linterna inspirada en el japonés. Crea simetría visual y silábica.',
			diamante: 'Poema de contraste en forma de diamante. La primera y última línea son opuestos.',
			fib: 'Basado en la secuencia Fibonacci. El conteo de sílabas de cada línea sigue la secuencia.'
		}
	};

	function getTip(form: string): string {
		// Hacer type assertion para asegurar que form es una clave válida
		const formKey = form as TipKey;

		if (currentLocale === 'en' || currentLocale === 'es') {
			return tips[currentLocale]?.[formKey] || '';
		}
		return tips.en?.[formKey] || '';
	}
</script>

/// src/lib/components/ContextualHelp.svelte
{#if showTips}
	<div
		class="mt-3 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md"
	>
		<div class="flex items-start gap-2">
			<span class="text-amber-600 dark:text-amber-400 text-sm">💡</span>
			<div class="text-sm">
				<strong class="text-amber-800 dark:text-amber-200">
					{currentLocale === 'es' ? 'Consejo para' : 'Tip for'}
					{getFormName(form)}:
				</strong>
				<p class="text-amber-700 dark:text-amber-300 mt-1">
					{getTip(form)}
				</p>
			</div>
		</div>
	</div>
{/if}
