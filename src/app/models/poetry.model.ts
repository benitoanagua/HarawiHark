export interface PoetryForm {
  id: string;
  name: string;
  pattern: number[];
  lines: number;
  origin: string;
  description: string;
}

export interface LineAnalysis {
  text: string;
  count: number;
  expected: number;
  match: boolean;
  syllables: string[];
  stresses?: string;
}

export interface PoetryResult {
  ok: boolean;
  form: string;
  totalLines: {
    expected: number;
    actual: number;
  };
  lines: LineAnalysis[];
  summary: string;
  rhymeScheme?: string;
  suggestions: string[];
}

export interface MeterAnalysis {
  pattern: string;
  type: string;
  consistency: number;
}
