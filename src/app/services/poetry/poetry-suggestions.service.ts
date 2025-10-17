import { Injectable, inject } from '@angular/core';
import { RitaService, type AlternativeWord } from './rita.service';

export interface WordSuggestionData {
  original: string;
  currentSyllables: number;
  targetSyllables: number;
  alternatives: AlternativeWord[];
}

@Injectable({
  providedIn: 'root',
})
export class PoetrySuggestionsService {
  private readonly rita = inject(RitaService);

  async getWordAlternatives(word: string, targetSyllables: number): Promise<WordSuggestionData> {
    const currentSyllables = this.rita.analyzeLine(word).syllables;
    const alternatives = await this.rita.suggestAlternatives(word, targetSyllables, 12);

    return {
      original: word,
      currentSyllables,
      targetSyllables,
      alternatives,
    };
  }

  generateLineSuggestions(line: string, targetSyllables: number): string[] {
    return this.rita.generateSuggestions(line, targetSyllables);
  }

  async getEnhancedAlternatives(word: string, targetSyllables: number): Promise<AlternativeWord[]> {
    const [basic, semantic, spelling, morphological] = await Promise.all([
      this.rita.suggestAlternatives(word, targetSyllables, 5),
      this.rita.findSemanticRhymes(word, targetSyllables),
      this.rita.findSpellingSuggestions(word, targetSyllables),
      Promise.resolve(
        this.rita
          .suggestMorphologicalVariants(word)
          .map((w) => ({
            word: w,
            syllables: this.rita.analyzeLine(w).syllables,
            reason: 'morphological' as const,
            pos: this.rita.analyzeGrammar(w).pos,
          }))
          .filter((w) => w.syllables === targetSyllables)
      ),
    ]);

    const allAlternatives = [...basic, ...semantic, ...spelling, ...morphological];
    return allAlternatives
      .filter(
        (alt, idx, self) =>
          idx === self.findIndex((a) => a.word.toLowerCase() === alt.word.toLowerCase())
      )
      .slice(0, 12);
  }

  generateImprovementSuggestions(lines: string[], pattern: number[]): string[] {
    const suggestions: string[] = [];

    if (lines.length < pattern.length) {
      const missing = pattern.length - lines.length;
      suggestions.push(`Add ${missing} more line${missing > 1 ? 's' : ''} to complete the pattern`);
    } else if (lines.length > pattern.length) {
      const extra = lines.length - pattern.length;
      suggestions.push(`Remove ${extra} line${extra > 1 ? 's' : ''} to match the pattern`);
    }

    lines.forEach((line, index) => {
      if (index < pattern.length) {
        const analysis = this.rita.analyzeLine(line);
        if (analysis.syllables !== pattern[index]) {
          const diff = pattern[index] - analysis.syllables;
          if (diff > 0) {
            suggestions.push(`Line ${index + 1}: Add ${diff} syllable${diff > 1 ? 's' : ''}`);
          } else {
            suggestions.push(
              `Line ${index + 1}: Remove ${Math.abs(diff)} syllable${Math.abs(diff) > 1 ? 's' : ''}`
            );
          }
        }
      }
    });

    return suggestions.slice(0, 5);
  }
}
