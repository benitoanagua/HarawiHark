import { Injectable, inject, signal } from '@angular/core';
import { RitaService } from './rita.service';
import { POETRY_FORMS } from '../data/poetry-forms.data';
import { LineAnalysis, PoetryResult } from '../models/poetry.model';

@Injectable({
  providedIn: 'root',
})
export class PoetryAnalyzerService {
  private readonly rita = inject(RitaService);

  readonly isLoading = signal(false);
  readonly result = signal<PoetryResult | null>(null);

  analyze(formKey: string, rawLines: string[]): PoetryResult {
    this.isLoading.set(true);

    try {
      const form = POETRY_FORMS[formKey];
      if (!form) {
        throw new Error(`unknown form "${formKey}"`);
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
        ? `perfect match: all ${lineAnalyses.length} lines follow the ${form.pattern.join(
            '-'
          )} pattern`
        : `${mismatches} of ${lineAnalyses.length} lines don't match the expected pattern`;

      const suggestions = this.generateSuggestions(lineAnalyses, form.pattern);
      const rhymeScheme = lines.length > 1 ? this.rita.analyzeRhymeScheme(lines) : undefined;

      const result: PoetryResult = {
        ok,
        form: formKey,
        totalLines: {
          expected: form.pattern.length,
          actual: lineAnalyses.length,
        },
        lines: lineAnalyses,
        summary,
        rhymeScheme,
        suggestions,
      };

      this.result.set(result);
      return result;
    } finally {
      this.isLoading.set(false);
    }
  }

  clear(): void {
    this.result.set(null);
  }

  private generateSuggestions(lines: LineAnalysis[], pattern: number[]): string[] {
    const suggestions: string[] = [];

    if (lines.length < pattern.length) {
      const missing = pattern.length - lines.length;
      suggestions.push(`add ${missing} more line${missing > 1 ? 's' : ''} to complete the pattern`);
    } else if (lines.length > pattern.length) {
      const extra = lines.length - pattern.length;
      suggestions.push(`remove ${extra} line${extra > 1 ? 's' : ''} to match the pattern`);
    }

    lines.forEach((line, index) => {
      if (!line.match && index < pattern.length) {
        const lineSuggestions = this.rita.generateSuggestions(line.text, pattern[index]);
        suggestions.push(`line ${index + 1}: ${lineSuggestions[0]}`);
      }
    });

    return suggestions.slice(0, 5);
  }
}
