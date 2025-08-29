export interface PoetryForm {
	name: string;
	pattern: number[];
	description: string;
	lines: number;
	examples: {
		en: string[];
		es: string[];
	};
}

export const POETRY_FORMS: Record<string, PoetryForm> = {
	// === FORMAS JAPONESAS (más populares) ===
	haiku: {
		name: 'Haiku',
		pattern: [5, 7, 5],
		description: 'Traditional Japanese nature poem',
		lines: 3,
		examples: {
			en: ['An old silent pond', 'A frog jumps into the pond—', 'Splash! Silence again.'],
			es: ['Viejo estanque', 'Una rana salta al agua', 'Sonido del agua']
		}
	},

	tanka: {
		name: 'Tanka',
		pattern: [5, 7, 5, 7, 7],
		description: 'Extended Japanese court poetry',
		lines: 5,
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

	// === FORMAS ANGLOSAJONAS (simples) ===
	cinquain: {
		name: 'Cinquain',
		pattern: [2, 4, 6, 8, 2],
		description: 'American imagist form with crescendo shape',
		lines: 5,
		examples: {
			en: ['Night', 'windswept', 'darkness hums', 'a silent chorus', 'hush'],
			es: ['Luz', 'dorada', 'el sol desciende', 'entre nubes de colores', 'paz']
		}
	},

	limerick: {
		name: 'Limerick',
		pattern: [8, 8, 5, 5, 8],
		description: 'Humorous five-line form',
		lines: 5,
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

	// === FORMAS HISPANAS (esenciales) ===
	redondilla: {
		name: 'Redondilla',
		pattern: [8, 8, 8, 8],
		description: 'Spanish octosyllabic quatrain',
		lines: 4,
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
		name: 'Lanterne',
		pattern: [1, 2, 3, 4, 1],
		description: 'Japanese-inspired lantern-shaped poem',
		lines: 5,
		examples: {
			en: ['Light', 'glows soft', 'in the darkness', 'casting gentle shadows', 'peace'],
			es: ['Luz', 'brilla', 'en la noche', 'creando sombras suaves', 'calma']
		}
	},

	// === FORMAS GEOMÉTRICAS (simples) ===
	diamante: {
		name: 'Diamante',
		pattern: [1, 2, 3, 4, 3, 2, 1],
		description: 'Diamond-shaped syllabic poem',
		lines: 7,
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

	// === FORMAS NUMÉRICAS (fáciles) ===
	fib: {
		name: 'Fibonacci',
		pattern: [1, 1, 2, 3, 5, 8],
		description: 'Based on Fibonacci sequence',
		lines: 6,
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

// Patrones simplificados para la API
export const SIMPLE_PATTERNS: Record<string, number[]> = {
	haiku: [5, 7, 5],
	tanka: [5, 7, 5, 7, 7],
	cinquain: [2, 4, 6, 8, 2],
	limerick: [8, 8, 5, 5, 8],
	redondilla: [8, 8, 8, 8],
	lanterne: [1, 2, 3, 4, 1],
	diamante: [1, 2, 3, 4, 3, 2, 1],
	fib: [1, 1, 2, 3, 5, 8]
};

// Helper para obtener descripción de forma
export function getFormDescription(form: string, locale: 'en' | 'es' = 'en'): string {
	const poetryForm = POETRY_FORMS[form];
	if (!poetryForm) return '';

	const spanishTranslations: Record<string, string> = {
		haiku: 'Poema tradicional japonés sobre la naturaleza',
		tanka: 'Poesía cortesana japonesa extendida',
		cinquain: 'Forma imagista americana con forma crescendo',
		limerick: 'Forma humorística de cinco líneas',
		redondilla: 'Cuarteta octosílaba española',
		lanterne: 'Poema en forma de linterna japonesa',
		diamante: 'Poema silábico en forma de diamante',
		fib: 'Basado en la secuencia de Fibonacci'
	};

	if (locale === 'es') {
		return spanishTranslations[form] || poetryForm.description;
	}

	return poetryForm.description;
}

// Helper para validación
export function isValidForm(form: string): boolean {
	return form in SIMPLE_PATTERNS;
}

// Helper para obtener ejemplo
export function getExample(form: string, locale: 'en' | 'es' = 'en'): string[] {
	const poetryForm = POETRY_FORMS[form];
	return poetryForm?.examples[locale] || [];
}
