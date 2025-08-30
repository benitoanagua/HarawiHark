import { getLocale } from '$lib/paraglide/runtime';
import { m } from '$lib/paraglide/messages.js';
import { POETRY_FORMS } from '$lib/data/poetry-forms.js';
import type { Locale } from '$lib/models/poetry.js';

export function getCurrentLocale(): Locale {
	return getLocale() as Locale;
}

export function getFormName(form: string): string {
	const key = `form_${form}` as keyof typeof m;
	const messageFn = m[key] as () => string;
	return messageFn?.() || form;
}

export function getFormDescription(form: string): string {
	const key = `form_${form}_desc` as keyof typeof m;
	const messageFn = m[key] as () => string;
	return messageFn?.() || POETRY_FORMS[form]?.name || '';
}

export function getFormExample(form: string, locale?: Locale): string[] {
	const currentLocale = locale || getCurrentLocale();
	const poetryForm = POETRY_FORMS[form];

	if (poetryForm && poetryForm.examples[currentLocale]) {
		return poetryForm.examples[currentLocale];
	}

	return poetryForm?.examples.en || [];
}
