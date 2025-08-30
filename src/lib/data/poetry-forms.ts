import type { PoetryForm } from '$lib/models/poetry.js';
import { m } from '$lib/paraglide/messages.js';

export const POETRY_FORMS: Record<string, Omit<PoetryForm, 'examples'>> = {
	haiku: {
		name: 'haiku',
		pattern: [5, 7, 5]
	},
	tanka: {
		name: 'tanka',
		pattern: [5, 7, 5, 7, 7]
	},
	cinquain: {
		name: 'cinquain',
		pattern: [2, 4, 6, 8, 2]
	},
	limerick: {
		name: 'limerick',
		pattern: [8, 8, 5, 5, 8]
	},
	redondilla: {
		name: 'redondilla',
		pattern: [8, 8, 8, 8]
	},
	lanterne: {
		name: 'lanterne',
		pattern: [1, 2, 3, 4, 1]
	},
	diamante: {
		name: 'diamante',
		pattern: [1, 2, 3, 4, 3, 2, 1]
	},
	fib: {
		name: 'fib',
		pattern: [1, 1, 2, 3, 5, 8]
	}
};

// Función para obtener ejemplos desde los mensajes
export function getFormExamples(form: string): string[] {
	const lines: string[] = [];

	// Determinar cuántas líneas tiene este formulario
	const pattern = POETRY_FORMS[form]?.pattern || [];

	for (let i = 1; i <= pattern.length; i++) {
		const messageKey = `example_${form}_line${i}` as keyof typeof m;
		const messageFn = m[messageKey] as any;
		if (typeof messageFn === 'function') {
			const line = messageFn({}) || '';
			if (line) lines.push(line);
		}
	}

	return lines;
}

// Patrón derivado automáticamente
export const SIMPLE_PATTERNS = Object.fromEntries(
	Object.entries(POETRY_FORMS).map(([key, form]) => [key, form.pattern])
);

export function isValidForm(form: string): boolean {
	return form in POETRY_FORMS;
}

export function getFormPattern(form: string): number[] {
	return POETRY_FORMS[form]?.pattern || [];
}
