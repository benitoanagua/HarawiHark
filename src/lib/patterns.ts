import { m } from '$lib/paraglide/messages.js';
import type { Locale } from '$lib/paraglide/runtime';

export interface PoetryForm {
	name: string;
	pattern: number[];
	examples: {
		en: string[];
		es: string[];
	};
}

export const POETRY_FORMS: Record<string, PoetryForm> = {
	haiku: {
		name: 'haiku',
		pattern: [5, 7, 5],
		examples: {
			en: ['An old silent pond', 'A frog jumps into the pond—', 'Splash! Silence again.'],
			es: ['Viejo estanque', 'Una rana salta al agua', 'Sonido del agua']
		}
	},

	tanka: {
		name: 'tanka',
		pattern: [5, 7, 5, 7, 7],
		examples: {
			en: [
				'Spring rain whispers',
				'Cherry petals drift downward',
				'Pink snow on still water',
				'Your laughter echoes softly',
				'Across the mirrored sky'
			],
			es: [
				'Lluvia de abril',
				'Los pétalos caen lentos',
				'Nieve rosa en agua',
				'Tu risa suena clara',
				'Sobre el cielo reflejado'
			]
		}
	},

	cinquain: {
		name: 'cinquain',
		pattern: [2, 4, 6, 8, 2],
		examples: {
			en: ['Night', 'windswept', 'darkness hums', 'a silent chorus', 'hush'],
			es: ['Luz', 'dorada', 'el sol desciende', 'entre nubes de colores', 'paz']
		}
	},

	limerick: {
		name: 'limerick',
		pattern: [8, 8, 5, 5, 8],
		examples: {
			en: [
				'There once was a cat from Peru',
				'Who dreamed of sailing canoe',
				'It jumped in the boat',
				"But couldn't float",
				"And now it just mews 'I can't do!'"
			],
			es: [
				'Había un gato en España',
				'Que soñaba con ir a montaña',
				'Subió muy alto',
				'Pegó un salto',
				'Y ahora vive en cabaña'
			]
		}
	},

	redondilla: {
		name: 'redondilla',
		pattern: [8, 8, 8, 8],
		examples: {
			en: [
				'In gardens where roses bloom',
				'The morning light breaks through gloom',
				'Each petal holds drops of dew',
				'As nature begins anew'
			],
			es: [
				'En jardines de colores',
				'Danzan libres mariposas',
				'Entre pétalos y flores',
				'Perfuman las dulces cosas'
			]
		}
	},

	lanterne: {
		name: 'lanterne',
		pattern: [1, 2, 3, 4, 1],
		examples: {
			en: ['Light', 'glows soft', 'in the darkness', 'casting gentle shadows', 'peace'],
			es: ['Luz', 'brilla', 'en la noche', 'creando sombras suaves', 'calma']
		}
	},

	diamante: {
		name: 'diamante',
		pattern: [1, 2, 3, 4, 3, 2, 1],
		examples: {
			en: [
				'Sun',
				'bright warm',
				'golden rays shine',
				'through morning clouds dancing',
				'light filters down',
				'gentle soft',
				'peace'
			],
			es: [
				'Mar',
				'azul claro',
				'olas van y vienen',
				'espuma blanca en la orilla',
				'arena tibia',
				'suave brisa',
				'calma'
			]
		}
	},

	fib: {
		name: 'fib',
		pattern: [1, 1, 2, 3, 5, 8],
		examples: {
			en: [
				'I',
				'am',
				'watching',
				'raindrops race',
				'down the window slowly',
				'each one a tiny universe complete'
			],
			es: [
				'Yo',
				'veo',
				'estrellas',
				'brillan arriba',
				'en la noche clara y fría',
				'susurran secretos antiguos del cosmos'
			]
		}
	}
};

// Generar patrones simples automáticamente
export const SIMPLE_PATTERNS: Record<string, number[]> = Object.fromEntries(
	Object.entries(POETRY_FORMS).map(([key, form]) => [key, form.pattern])
);

// Funciones simplificadas
export function getFormDescription(form: string): string {
	const key = `form_${form}_desc` as keyof typeof m;
	const messageFn = m[key] as () => string;
	return messageFn?.() || form;
}

export function getFormName(form: string): string {
	const key = `form_${form}` as keyof typeof m;
	const messageFn = m[key] as () => string;
	return messageFn?.() || form;
}

export function isValidForm(form: string): boolean {
	return form in POETRY_FORMS;
}

export function getExample(form: string, locale: Locale = 'en'): string[] {
	const poetryForm = POETRY_FORMS[form];
	if (poetryForm && (locale === 'en' || locale === 'es')) {
		return poetryForm.examples[locale] || [];
	}
	return [];
}
