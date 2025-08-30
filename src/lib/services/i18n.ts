import { getLocale } from '$lib/paraglide/runtime';
import { m } from '$lib/paraglide/messages.js';
import { getFormExamples } from '$lib/data/poetry-forms.js';
import type { Locale } from '$lib/models/poetry.js';

export const getCurrentLocale = (): Locale => getLocale() as Locale;

export const getFormName = (form: string): string => {
	const key = `form_${form}` as keyof typeof m;
	const messageFn = m[key] as any;
	return typeof messageFn === 'function' ? messageFn({}) : form;
};

export const getFormDescription = (form: string): string => {
	const key = `form_${form}_desc` as keyof typeof m;
	const messageFn = m[key] as any;
	return typeof messageFn === 'function' ? messageFn({}) : '';
};

export const getFormExample = (form: string): string[] => {
	return getFormExamples(form);
};
