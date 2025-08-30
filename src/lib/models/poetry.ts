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
