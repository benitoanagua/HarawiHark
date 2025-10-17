import { Injectable, inject } from '@angular/core';
import { RitaService, type AlternativeWord } from './rita.service';

export interface WordSuggestionData {
  original: string;
  currentSyllables: number;
  targetSyllables: number;
  alternatives: AlternativeWord[];
}

export interface SuggestionContext {
  pos?: string;
  lineIndex?: number;
  isLineEnd?: boolean;
  previousWord?: string;
}

@Injectable({
  providedIn: 'root',
})
export class PoetrySuggestionsService {
  private readonly rita = inject(RitaService);

  async getWordAlternativesEnhanced(
    word: string,
    targetSyllables: number,
    context: SuggestionContext = {}
  ): Promise<WordSuggestionData> {
    const currentSyllables = this.rita.analyzeLine(word).syllables;

    const [exactMatches, rhymes, phonetic, spelling] = await Promise.all([
      this.searchBySyllablesAndPOS(targetSyllables, context.pos),

      context.isLineEnd
        ? this.rita.findRhymes(word, targetSyllables).then((r) => r.perfectRhymes)
        : Promise.resolve([]),

      this.rita.suggestAlternatives(word, targetSyllables, 5),

      this.rita.findSpellingSuggestions(word, targetSyllables),
    ]);

    const allAlternatives = [
      ...exactMatches,
      ...rhymes.map((w) => ({
        word: w,
        syllables: targetSyllables,
        reason: 'rhyme-match' as const,
        pos: this.rita.analyzeGrammar(w).pos,
      })),
      ...phonetic,
      ...spelling,
    ];

    const unique = this.deduplicateAndRank(allAlternatives, word, context);

    return {
      original: word,
      currentSyllables,
      targetSyllables,
      alternatives: unique.slice(0, 12),
    };
  }

  private async searchBySyllablesAndPOS(
    syllables: number,
    pos?: string
  ): Promise<AlternativeWord[]> {
    try {
      const results = await this.rita.advancedSearch({
        syllables,
        pos,
      });

      return results.slice(0, 8).map((word) => ({
        word,
        syllables,
        reason: 'exact-match' as const,
        pos: this.rita.analyzeGrammar(word).pos,
      }));
    } catch (error) {
      console.warn('Search by syllables failed:', error);
      return [];
    }
  }

  private deduplicateAndRank(
    alternatives: AlternativeWord[],
    originalWord: string,
    context: SuggestionContext
  ): AlternativeWord[] {
    const seen = new Set<string>();
    const unique = alternatives.filter((alt) => {
      const key = alt.word.toLowerCase();
      if (seen.has(key) || key === originalWord.toLowerCase()) {
        return false;
      }
      seen.add(key);
      return true;
    });

    return unique.sort((a, b) => {
      if (a.reason === 'exact-match' && b.reason !== 'exact-match') return -1;
      if (b.reason === 'exact-match' && a.reason !== 'exact-match') return 1;

      if (context.isLineEnd) {
        if (a.reason === 'rhyme-match' && b.reason !== 'rhyme-match') return -1;
        if (b.reason === 'rhyme-match' && a.reason !== 'rhyme-match') return 1;
      }

      if (context.pos) {
        const aMatchesPOS = a.pos === context.pos;
        const bMatchesPOS = b.pos === context.pos;
        if (aMatchesPOS && !bMatchesPOS) return -1;
        if (bMatchesPOS && !aMatchesPOS) return 1;
      }

      return 0;
    });
  }

  async getWordAlternatives(word: string, targetSyllables: number): Promise<WordSuggestionData> {
    return this.getWordAlternativesEnhanced(word, targetSyllables);
  }

  generateLineSuggestions(line: string, targetSyllables: number): string[] {
    return this.rita.generateSuggestions(line, targetSyllables);
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
