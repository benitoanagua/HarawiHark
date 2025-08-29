import { writable } from 'svelte/store';
import { getLocale } from '$lib/paraglide/runtime';

interface CheckResult {
	ok: boolean;
	lines: Array<{
		text: string;
		count: number;
		expected: number;
		match: boolean;
	}>;
	summary?: string;
	form: string;
	totalLines: {
		expected: number;
		actual: number;
	};
}

interface PoetryCheckerState {
	result: CheckResult | null;
	loading: boolean;
	error: string | null;
}

export function createPoetryChecker() {
	const { subscribe, set, update } = writable<PoetryCheckerState>({
		result: null,
		loading: false,
		error: null
	});

	async function checkPoem(lines: string[], form: string) {
		update((state) => ({ ...state, loading: true, error: null }));

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

			const result = await response.json();
			update((state) => ({ ...state, result, loading: false }));

			return result;
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
			update((state) => ({ ...state, error: errorMessage, loading: false }));
			throw error;
		}
	}

	function reset() {
		set({ result: null, loading: false, error: null });
	}

	function clearError() {
		update((state) => ({ ...state, error: null }));
	}

	return {
		subscribe,
		checkPoem,
		reset,
		clearError
	};
}
