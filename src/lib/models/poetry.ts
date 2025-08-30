export type Locale = 'en' | 'es';

export interface PoetryForm {
	name: string;
	pattern: number[];
	examples: Record<Locale, string[]>;
}

export interface LineAnalysis {
	text: string;
	count: number;
	expected: number;
	match: boolean;
	syllables?: string[];
}

export interface PoetryAnalysisResult {
	ok: boolean;
	form: string;
	totalLines: {
		expected: number;
		actual: number;
	};
	lines: LineAnalysis[];
	summary?: string;
}

export interface CheckRequest {
	form: string;
	locale?: Locale;
	lines: string[];
}

export interface CheckResponse extends Omit<PoetryAnalysisResult, 'lines'> {
	lines: LineAnalysis[];
}
