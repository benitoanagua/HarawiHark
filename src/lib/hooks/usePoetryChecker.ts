import { getLocale } from '$lib/paraglide/runtime';

export async function checkPoem(lines: string[], form: string) {
	try {
		const locale = getLocale();
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
	} catch (error) {
		throw error instanceof Error ? error : new Error('An unexpected error occurred');
	}
}
