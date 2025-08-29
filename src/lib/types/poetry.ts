export interface PoetryLine {
	text: string;
	syllableCount: number;
	expectedSyllables: number;
	isMatch: boolean;
	words?: string[];
}

export interface PoetryAnalysis {
	form: string;
	lines: PoetryLine[];
	isValid: boolean;
	accuracy: number;
	totalSyllables: number;
	expectedSyllables: number;
	locale: 'en' | 'es';
	timestamp: Date;
}

export interface PoetryFormDefinition {
	key: string;
	name: string;
	pattern: number[];
	description: string;
	examples: Record<'en' | 'es', string[]>;
	difficulty: 'easy' | 'medium' | 'hard';
	origin: string;
	tips: Record<'en' | 'es', string>;
}
