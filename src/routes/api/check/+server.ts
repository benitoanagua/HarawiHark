import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { countEs, countEn } from 'simi-syllable';

const PATTERNS: Record<string, number[]> = {
	haiku: [5, 7, 5],
	tanka: [5, 7, 5, 7, 7],
	cinquain: [2, 4, 6, 8, 2],
	nonet: [9, 8, 7, 6, 5, 4, 3, 2, 1],
	etheree: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
	fib: [1, 1, 2, 3, 5, 8],
	lanterne: [1, 2, 3, 4, 1],
	gogyoka: [],
	'rondel-supreme': Array(14).fill(8),
	'sapphic-stanza': [11, 11, 11, 5]
};

function countSyllables(text: string, locale: string): number {
	if (!text.trim()) return 0;

	try {
		if (locale === 'es') {
			return countEs(text);
		} else {
			return countEn(text);
		}
	} catch (error) {
		console.error('Error counting syllables:', error);
		// Fallback: contar palabras como aproximación
		return text.trim().split(/\s+/).filter(Boolean).length;
	}
}

export const POST: RequestHandler = async ({ request }) => {
	const { form, locale = 'en', lines } = await request.json();
	const pattern = PATTERNS[form] || [];

	const syllableCounts = lines.map((line: string) => countSyllables(line, locale));

	const ok =
		pattern.length === lines.length &&
		pattern.every((expected, i) => expected === 0 || syllableCounts[i] === expected);

	return json({
		ok,
		lines: lines.map((text: string, i: number) => ({
			text,
			count: syllableCounts[i],
			expected: pattern[i] ?? 0
		}))
	});
};
