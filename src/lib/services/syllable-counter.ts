import { countEs, countEn } from 'simi-syllable';
import type { Locale } from '$lib/models/poetry.js';

export function countSyllables(text: string, locale: Locale): number {
	if (!text.trim()) return 0;

	try {
		return locale === 'es' ? countEs(text) : countEn(text);
	} catch (error) {
		console.error('Error counting syllables:', error);
		// Fallback: count words as approximate syllables
		return text.trim().split(/\s+/).filter(Boolean).length;
	}
}
