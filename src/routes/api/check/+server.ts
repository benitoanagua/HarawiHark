import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { countEs, countEn } from 'simi-syllable';
import { SIMPLE_PATTERNS, isValidForm } from '$lib/patterns';

interface CheckRequest {
	form: string;
	locale?: 'en' | 'es';
	lines: string[];
}

interface LineResult {
	text: string;
	count: number;
	expected: number;
	match: boolean;
}

interface CheckResponse {
	ok: boolean;
	form: string;
	totalLines: {
		expected: number;
		actual: number;
	};
	lines: LineResult[];
	summary?: string;
	messages?: {
		perfect_match?: string;
		lines_mismatch?: string;
	};
}

function countSyllables(text: string, locale: 'en' | 'es'): number {
	if (!text.trim()) return 0;

	try {
		return locale === 'es' ? countEs(text) : countEn(text);
	} catch (error) {
		console.error('Error counting syllables:', error);
		return text.trim().split(/\s+/).filter(Boolean).length;
	}
}

function generateSummary(result: CheckResponse, locale: 'en' | 'es'): string {
	const { ok, totalLines, lines } = result;
	const mismatches = lines.filter((l) => !l.match).length;

	if (locale === 'es') {
		return ok
			? `✅ Patrón perfecto: todas las ${totalLines.actual} líneas siguen el patrón.`
			: `❌ ${mismatches} de ${totalLines.actual} líneas no coinciden con el patrón.`;
	} else {
		return ok
			? `✅ Perfect match: all ${totalLines.actual} lines follow the pattern.`
			: `❌ ${mismatches} out of ${totalLines.actual} lines don't match the pattern.`;
	}
}

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { form, locale = 'en', lines }: CheckRequest = await request.json();

		// Validaciones
		if (!form || !isValidForm(form)) {
			const errorMessage =
				locale === 'es'
					? 'Forma poética inválida o no soportada'
					: 'Invalid or unsupported poetry form';

			return json(
				{
					error: errorMessage,
					supportedForms: Object.keys(SIMPLE_PATTERNS)
				},
				{ status: 400 }
			);
		}

		if (!lines || !Array.isArray(lines)) {
			const errorMessage =
				locale === 'es'
					? 'Las líneas deben ser un array de strings'
					: 'Lines must be an array of strings';

			return json({ error: errorMessage }, { status: 400 });
		}

		if (lines.length === 0) {
			const errorMessage =
				locale === 'es' ? 'Se requiere al menos una línea' : 'At least one line is required';

			return json({ error: errorMessage }, { status: 400 });
		}

		const pattern = SIMPLE_PATTERNS[form];
		const cleanLines = lines.filter((line) => typeof line === 'string' && line.trim());

		const lineResults: LineResult[] = cleanLines.map((text, index) => {
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

		const response: CheckResponse = {
			ok,
			form,
			totalLines: {
				expected: pattern.length,
				actual: cleanLines.length
			},
			lines: lineResults,
			summary: generateSummary(
				{
					ok,
					form,
					totalLines: {
						expected: pattern.length,
						actual: cleanLines.length
					},
					lines: lineResults
				},
				locale
			)
		};

		return json(response);
	} catch (error) {
		console.error('API Error:', error);

		const errorMessage = error instanceof Error ? error.message : 'Unknown error';
		return json(
			{
				error: 'Internal server error processing your poem',
				details: errorMessage
			},
			{ status: 500 }
		);
	}
};

export const GET: RequestHandler = async ({ url }) => {
	const locale = (url.searchParams.get('locale') as 'en' | 'es') || 'en';

	const formsInfo = Object.entries(SIMPLE_PATTERNS).map(([key, pattern]) => ({
		name: key,
		pattern,
		lines: pattern.length,
		description: `${pattern.join('-')} syllables over ${pattern.length} lines`
	}));

	return json({
		availableForms: formsInfo,
		supportedLocales: ['en', 'es'],
		version: '1.0.0',
		locale
	});
};
