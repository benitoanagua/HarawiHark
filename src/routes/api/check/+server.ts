import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { countEs, countEn } from 'simi-syllable';
import { SIMPLE_PATTERNS, isValidForm } from '$lib/patterns';

interface CheckRequest {
	form: string;
	locale?: string;
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
}

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
		// Fallback: contar palabras como aproximación básica
		return text.trim().split(/\s+/).filter(Boolean).length;
	}
}

function generateSummary(result: CheckResponse, locale: string): string {
	const { ok, totalLines, lines } = result;

	if (locale === 'es') {
		if (ok) {
			return `✅ Patrón correcto: ${totalLines.actual} líneas coinciden perfectamente.`;
		} else {
			const mismatches = lines.filter((l) => !l.match).length;
			return `❌ ${mismatches} de ${totalLines.actual} líneas no coinciden con el patrón.`;
		}
	} else {
		if (ok) {
			return `✅ Perfect match: all ${totalLines.actual} lines follow the pattern.`;
		} else {
			const mismatches = lines.filter((l) => !l.match).length;
			return `❌ ${mismatches} out of ${totalLines.actual} lines don't match the pattern.`;
		}
	}
}

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { form, locale = 'en', lines }: CheckRequest = await request.json();

		// Validaciones
		if (!form || !isValidForm(form)) {
			return json(
				{
					error: 'Invalid or unsupported poetry form',
					supportedForms: Object.keys(SIMPLE_PATTERNS)
				},
				{ status: 400 }
			);
		}

		if (!lines || !Array.isArray(lines)) {
			return json({ error: 'Lines must be an array of strings' }, { status: 400 });
		}

		if (lines.length === 0) {
			return json({ error: 'At least one line is required' }, { status: 400 });
		}

		const pattern = SIMPLE_PATTERNS[form];
		const cleanLines = lines.filter((line) => typeof line === 'string' && line.trim());

		// Contar sílabas para cada línea
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

		// Verificar si todo coincide
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
		return json(
			{
				error: 'Internal server error processing your poem',
				details: error instanceof Error ? error.message : 'Unknown error'
			},
			{ status: 500 }
		);
	}
};

// GET endpoint para obtener información de formas disponibles
export const GET: RequestHandler = async () => {
	const formsInfo = Object.entries(SIMPLE_PATTERNS).map(([key, pattern]) => ({
		name: key,
		pattern,
		lines: pattern.length,
		description: `${pattern.join('-')} syllables over ${pattern.length} lines`
	}));

	return json({
		availableForms: formsInfo,
		supportedLocales: ['en', 'es'],
		version: '1.0.0'
	});
};
