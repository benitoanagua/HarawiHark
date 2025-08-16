import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

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
	// placeholder rápido
	return text.trim().split(/\s+/).filter(Boolean).length;
}

export const POST: RequestHandler = async ({ request }) => {
	const { form, locale, lines } = await request.json();
	const pattern = PATTERNS[form] || [];
	const ok =
		pattern.length === lines.length &&
		pattern.every((p, i) => p === 0 || countSyllables(lines[i] || '', locale) === p);

	return json({
		ok,
		lines: lines.map((t: string, i: number) => ({
			text: t,
			count: countSyllables(t, locale),
			expected: pattern[i] ?? 0
		}))
	});
};
