import { Injectable } from '@angular/core';
import { RiTa } from 'rita';

export interface SyllableAnalysis {
  syllables: number;
  breakdown: string[];
  stresses: string;
}

@Injectable({
  providedIn: 'root',
})
export class RitaService {
  private readonly cache = new Map<string, SyllableAnalysis>();

  analyzeLine(line: string): SyllableAnalysis {
    const trimmedLine = line.trim();

    if (!trimmedLine) {
      return { syllables: 0, breakdown: [], stresses: '' };
    }

    const cacheKey = `line:${trimmedLine}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    const words = RiTa.tokenize(trimmedLine).filter((word) => /[a-zA-Z]/.test(word));

    let totalSyllables = 0;
    const syllables: string[] = [];
    const stresses: string[] = [];

    words.forEach((word) => {
      const syllableCount = RiTa.syllables(word).split('/').length;
      totalSyllables += syllableCount;

      const phones = RiTa.phones(word);
      if (phones) {
        syllables.push(...phones.split('-'));
      } else {
        syllables.push(word);
      }

      const stress = RiTa.stresses(word);
      if (stress) {
        stresses.push(stress);
      }
    });

    const result: SyllableAnalysis = {
      syllables: totalSyllables,
      breakdown: syllables,
      stresses: stresses.join('/'),
    };

    this.cache.set(cacheKey, result);
    return result;
  }

  isRhyme(word1: string, word2: string): boolean {
    try {
      return RiTa.isRhyme(word1.toLowerCase(), word2.toLowerCase());
    } catch {
      return false;
    }
  }

  analyzeRhymeScheme(lines: string[]): string {
    const scheme: string[] = [];
    let currentLetter = 'A';

    for (let i = 0; i < lines.length; i++) {
      const lastWord = this.getLastWord(lines[i]);
      let rhymeLetter = null;

      for (let j = 0; j < i; j++) {
        const previousLastWord = this.getLastWord(lines[j]);
        if (this.isRhyme(lastWord, previousLastWord)) {
          rhymeLetter = scheme[j];
          break;
        }
      }

      if (rhymeLetter) {
        scheme.push(rhymeLetter);
      } else {
        scheme.push(currentLetter);
        currentLetter = String.fromCharCode(currentLetter.charCodeAt(0) + 1);
      }
    }

    return scheme.join('');
  }

  generateSuggestions(line: string, targetSyllables: number): string[] {
    const currentSyllables = this.analyzeLine(line).syllables;
    const difference = targetSyllables - currentSyllables;

    if (difference === 0) {
      return ['line matches target syllable count'];
    }

    const suggestions: string[] = [];

    if (difference > 0) {
      suggestions.push(`add ${difference} syllable${difference > 1 ? 's' : ''} to this line`);
      suggestions.push('try adding descriptive words');
    } else {
      suggestions.push(
        `remove ${Math.abs(difference)} syllable${
          Math.abs(difference) > 1 ? 's' : ''
        } from this line`
      );
      suggestions.push('try using shorter words');
    }

    return suggestions;
  }

  private getLastWord(line: string): string {
    const words = RiTa.tokenize(line).filter((word) => /[a-zA-Z]/.test(word));
    return words[words.length - 1] || '';
  }
}
