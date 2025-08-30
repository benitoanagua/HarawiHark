import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { SIMPLE_PATTERNS, isValidForm } from '$lib/data/poetry-forms';
import {
	analyzePoemLines,
	generateAnalysisSummary,
	isPoemValid
} from '$lib/services/poem-analysis.js';
import type { CheckRequest, CheckResponse } from '$lib/models/poetry.js';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { form, locale = 'en', lines }: CheckRequest = await request.json();

		if (!form || !isValidForm(form)) {
			const errorMessage =
				locale === 'es'
					? 'Forma poética inválida o no soportada'
					: 'Invalid or unsupported poetry form';
			return json(
				{ error: errorMessage, supportedForms: Object.keys(SIMPLE_PATTERNS) },
				{ status: 400 }
			);
		}

		if (!lines?.length) {
			const errorMessage =
				locale === 'es' ? 'Se requiere al menos una línea' : 'At least one line is required';
			return json({ error: errorMessage }, { status: 400 });
		}

		const pattern = SIMPLE_PATTERNS[form];
		const lineResults = analyzePoemLines(lines, form, locale);
		const ok = isPoemValid(lineResults, pattern);

		const response: CheckResponse = {
			ok,
			form,
			totalLines: {
				expected: pattern.length,
				actual: lineResults.length
			},
			lines: lineResults,
			summary: generateAnalysisSummary(lineResults, locale, ok)
		};

		return json(response);
	} catch (error) {
		console.error('API Error:', error);
		const errorMessage = error instanceof Error ? error.message : 'Unknown error';
		return json({ error: 'Internal server error', details: errorMessage }, { status: 500 });
	}
};

export const GET: RequestHandler = async ({ url }) => {
	const locale = (url.searchParams.get('locale') as 'en' | 'es') || 'en';

	return json({
		availableForms: Object.entries(SIMPLE_PATTERNS).map(([key, pattern]) => ({
			name: key,
			pattern,
			lines: pattern.length
		})),
		supportedLocales: ['en', 'es'],
		version: '1.0.0',
		locale
	});
};
