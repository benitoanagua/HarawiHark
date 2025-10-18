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

    // Búsqueda simple y efectiva - CORREGIR parámetros
    const [exactMatches, rhymes, phonetic] = await Promise.all([
      this.searchBySyllables(targetSyllables), // ❌ Eliminar context.pos
      context.isLineEnd
        ? this.rita.findRhymes(word, targetSyllables).then((r) => r.perfectRhymes)
        : Promise.resolve([]),
      this.rita.suggestAlternatives(word, targetSyllables, 6),
    ]);

    const allAlternatives = [
      ...exactMatches,
      ...rhymes.map((w) => ({
        word: w, // ✅ w es string, no AlternativeWord
        syllables: targetSyllables,
        reason: 'rhyme-match' as const,
        pos: this.rita.analyzeGrammar(w).pos,
      })),
      ...phonetic,
    ];

    const unique = this.deduplicateAndRank(allAlternatives, word, context);

    return {
      original: word,
      currentSyllables,
      targetSyllables,
      alternatives: unique.slice(0, 10),
    };
  }

  private async searchBySyllables(syllables: number): Promise<AlternativeWord[]> {
    // ❌ Eliminar pos parameter
    try {
      // Búsqueda simple por primera letra y sílabas
      const results = await this.rita.suggestAlternatives('a', syllables, 8);

      // CORREGIR: results ya son AlternativeWord[], no strings
      return results.map((altWord) => ({
        // ✅ altWord es AlternativeWord
        ...altWord,
        reason: 'exact-match' as const,
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
}
