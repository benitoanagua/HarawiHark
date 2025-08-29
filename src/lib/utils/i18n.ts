import { getLocale, type Locale } from '$lib/paraglide/runtime';
// import { get } from 'svelte/store';

export function getCurrentLocale(): Locale {
	return getLocale();
}

export function isSpanish(): boolean {
	return getLocale() === 'es';
}

export function formatPlural(count: number, singular: string, plural: string): string {
	return count === 1 ? singular : plural;
}

export function getLocalizedExample(examples: { en: string[]; es: string[] }): string[] {
	const locale = getLocale();
	// Asegurar que locale sea una clave válida
	if (locale === 'en' || locale === 'es') {
		return examples[locale] || examples.en || [];
	}
	return examples.en || [];
}

// Función para formatear números según el idioma
export function formatNumber(num: number): string {
	const locale = getLocale();
	return new Intl.NumberFormat(locale === 'es' ? 'es-ES' : 'en-US').format(num);
}
