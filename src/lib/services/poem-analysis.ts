import { getFormPattern } from '$lib/data/poetry-forms.js';
import type { Locale, LineAnalysis } from '$lib/models/poetry.js';
import { syllabifyEn, syllabifyEs } from 'simi-syllable';
import { countEs, countEn } from 'simi-syllable';

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

export const getLineSyllables = (text: string, locale: Locale): string[] => {
	const words = text
		.trim()
		.split(/\s+/)
		.filter((word) => word.length > 0);
	const allSyllables: string[] = [];

	words.forEach((word) => {
		try {
			const wordSyllables = locale === 'es' ? syllabifyEs(word) : syllabifyEn(word);
			allSyllables.push(...wordSyllables);
		} catch (error) {
			// Si hay error en la silabificación, usar la palabra completa
			allSyllables.push(word);
		}
	});

	return allSyllables;
};

export const analyzePoemLines = (
	lines: string[],
	form: string,
	locale: Locale = 'en'
): LineAnalysis[] => {
	const pattern = getFormPattern(form);
	const cleanLines = lines.filter((line) => typeof line === 'string' && line.trim());

	return cleanLines.map((text, index) => {
		const count = countSyllables(text, locale);
		const expected = pattern[index] || 0;
		const match = count === expected;
		const syllables = getLineSyllables(text, locale);

		return {
			text: text.trim(),
			count,
			expected,
			match,
			syllables
		};
	});
};

export const generateAnalysisSummary = (
	lines: LineAnalysis[],
	locale: Locale,
	ok: boolean
): string => {
	const mismatches = lines.filter((l) => !l.match).length;
	const total = lines.length;

	if (locale === 'es') {
		return ok
			? `✅ Patrón perfecto: todas las ${total} líneas siguen el patrón.`
			: `❌ ${mismatches} de ${total} líneas no coinciden con el patrón.`;
	} else {
		return ok
			? `✅ Perfect match: all ${total} lines follow the pattern.`
			: `❌ ${mismatches} out of ${total} lines don't match the pattern.`;
	}
};

export const isPoemValid = (lines: LineAnalysis[], pattern: number[]): boolean => {
	const correctLineCount = lines.length === pattern.length;
	const allLinesMatch = lines.every((line) => line.match);
	return correctLineCount && allLinesMatch;
};
