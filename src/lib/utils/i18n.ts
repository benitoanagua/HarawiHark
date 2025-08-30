import { getLocale } from '$lib/paraglide/runtime';

export function isSpanish(): boolean {
	return getLocale() === 'es';
}
