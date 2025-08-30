import { getFormPattern } from '$lib/data/poetry-forms.js';
import { analyzePoemLines, generateAnalysisSummary, isPoemValid } from './poem-analysis.js';
import type { PoetryAnalysisResult, Locale } from '$lib/models/poetry.js';

export const checkPoemRemote = async (
	lines: string[],
	form: string,
	locale: Locale = 'en'
): Promise<PoetryAnalysisResult> => {
	const response = await fetch('/api/check', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			form,
			locale,
			lines: lines.filter((line) => line.trim())
		})
	});

	if (!response.ok) throw new Error(`Server error: ${response.status}`);
	return response.json();
};

export const analyzePoemLocally = (
	lines: string[],
	form: string,
	locale: Locale = 'en'
): PoetryAnalysisResult => {
	const pattern = getFormPattern(form);
	const lineResults = analyzePoemLines(lines, form, locale);
	const ok = isPoemValid(lineResults, pattern);

	return {
		ok,
		form,
		totalLines: {
			expected: pattern.length,
			actual: lineResults.length
		},
		lines: lineResults,
		summary: generateAnalysisSummary(lineResults, locale, ok)
	};
};
