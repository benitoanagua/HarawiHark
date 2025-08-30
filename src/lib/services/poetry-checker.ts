import { countSyllables } from './syllable-counter.js';
import { getFormPattern } from '$lib/data/poetry-forms.js';
import type { PoetryAnalysisResult, Locale, LineAnalysis } from '$lib/models/poetry.js';

export async function checkPoemRemote(
	lines: string[],
	form: string,
	locale: Locale = 'en'
): Promise<PoetryAnalysisResult> {
	const response = await fetch('/api/check', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			form,
			locale,
			lines: lines.filter((line) => line.trim())
		})
	});

	if (!response.ok) {
		const errorData = await response.json().catch(() => ({}));
		throw new Error(errorData.error || `Server error: ${response.status}`);
	}

	return await response.json();
}

export function analyzePoemLocally(
	lines: string[],
	form: string,
	locale: Locale = 'en'
): PoetryAnalysisResult {
	const pattern = getFormPattern(form);
	const cleanLines = lines.filter((line) => line.trim());

	const lineResults: LineAnalysis[] = cleanLines.map((text, index) => {
		const count = countSyllables(text, locale);
		const expected = pattern[index] || 0;
		const match = count === expected;

		return {
			text: text.trim(),
			count,
			expected,
			match
		};
	});

	const correctLineCount = cleanLines.length === pattern.length;
	const allLinesMatch = lineResults.every((line) => line.match);
	const ok = correctLineCount && allLinesMatch;

	return {
		ok,
		form,
		totalLines: {
			expected: pattern.length,
			actual: cleanLines.length
		},
		lines: lineResults,
		summary: generateSummary(lineResults, locale, ok)
	};
}

function generateSummary(lines: LineAnalysis[], locale: Locale, ok: boolean): string {
	const mismatches = lines.filter((l) => !l.match).length;
	const total = lines.length;

	if (locale === 'es') {
		return ok
			? `Patrón perfecto: todas las ${total} líneas siguen el patrón.`
			: `${mismatches} de ${total} líneas no coinciden con el patrón.`;
	} else {
		return ok
			? `Perfect match: all ${total} lines follow the pattern.`
			: `${mismatches} out of ${total} lines don't match the pattern.`;
	}
}
