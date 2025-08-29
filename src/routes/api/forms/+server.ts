import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { POETRY_FORMS, SIMPLE_PATTERNS, getFormDescription } from '$lib/patterns';

export const GET: RequestHandler = async ({ url }) => {
	const locale = (url.searchParams.get('locale') as 'en' | 'es') || 'en';

	const formsWithDetails = Object.entries(POETRY_FORMS).map(([key, form]) => ({
		key,
		name: form.name,
		pattern: form.pattern,
		lines: form.lines,
		examples: form.examples,
		description: getFormDescription(key)
	}));

	return json({
		forms: formsWithDetails,
		simplePatterns: SIMPLE_PATTERNS,
		locale,
		count: Object.keys(POETRY_FORMS).length
	});
};
