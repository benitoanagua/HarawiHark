import { Injectable, inject } from '@angular/core';
import { RitaService } from './rita.service';
import { POETRY_FORMS } from '../../data/poetry-forms.data';
import type { LineAnalysis } from '../../models/poetry.model';

export interface PoetryStructure {
  lines: LineAnalysis[];
  totalLines: { expected: number; actual: number };
  ok: boolean;
  summary: string;
}

@Injectable({
  providedIn: 'root',
})
export class PoetryAnalysisService {
  private readonly rita = inject(RitaService);

  analyzePoemStructure(rawLines: string[], formKey: string): PoetryStructure {
    const form = POETRY_FORMS[formKey];
    if (!form) {
      throw new Error(`Unknown form "${formKey}"`);
    }

    const lines = rawLines.map((line) => line.trim()).filter((line) => line.length > 0);

    const lineAnalyses: LineAnalysis[] = lines.map((line, index) => {
      const analysis = this.rita.analyzeLine(line);
      const expected = form.pattern[index] ?? 0;

      return {
        text: line,
        count: analysis.syllables,
        expected,
        match: analysis.syllables === expected,
        syllables: analysis.breakdown,
        stresses: analysis.stresses,
      };
    });

    const ok = lineAnalyses.length === form.pattern.length && lineAnalyses.every((l) => l.match);
    const mismatches = lineAnalyses.filter((l) => !l.match).length;
    const summary = ok
      ? `Perfect match: all ${lineAnalyses.length} lines follow the ${form.pattern.join(
          '-'
        )} pattern`
      : `${mismatches} of ${lineAnalyses.length} lines don't match the expected pattern`;

    return {
      lines: lineAnalyses,
      totalLines: {
        expected: form.pattern.length,
        actual: lineAnalyses.length,
      },
      ok,
      summary,
    };
  }

  validateLineSyllables(
    line: string,
    expectedSyllables: number
  ): { valid: boolean; actual: number } {
    const analysis = this.rita.analyzeLine(line);
    return {
      valid: analysis.syllables === expectedSyllables,
      actual: analysis.syllables,
    };
  }

  calculateSyllableAccuracy(lines: string[], pattern: number[]): number {
    if (lines.length !== pattern.length) return 0;

    let matches = 0;
    lines.forEach((line, index) => {
      const analysis = this.rita.analyzeLine(line);
      if (analysis.syllables === pattern[index]) {
        matches++;
      }
    });

    return (matches / pattern.length) * 100;
  }

  detectMeterPattern(lines: string[]): string[] {
    const patterns: string[] = [];
    const stressPatterns = lines
      .map((line) => {
        const analysis = this.rita.analyzeLine(line);
        return analysis.stresses;
      })
      .filter((s) => s && s.length > 0);

    if (stressPatterns.length > 2) {
      const firstPattern = stressPatterns[0];
      const allSame = stressPatterns.every((p) => p === firstPattern);
      if (allSame) {
        patterns.push(`Consistent meter: ${firstPattern}`);
      }
    }

    return patterns;
  }
}
