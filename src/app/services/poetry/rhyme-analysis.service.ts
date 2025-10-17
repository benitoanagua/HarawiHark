import { Injectable, inject } from '@angular/core';
import { RitaService, type AlliterationMatch } from './rita.service';

@Injectable({
  providedIn: 'root',
})
export class RhymeAnalysisService {
  private readonly rita = inject(RitaService);

  analyzeRhymeScheme(lines: string[]): string {
    return this.rita.analyzeRhymeScheme(lines);
  }

  detectCrossLineAlliterations(lines: string[]): AlliterationMatch[] {
    const allWords: { word: string; lineIndex: number; wordIndex: number }[] = [];

    lines.forEach((line, lineIndex) => {
      const words = line.split(/\s+/).filter((w) => /[a-zA-Z]/.test(w));
      words.forEach((word, wordIndex) => {
        allWords.push({ word, lineIndex, wordIndex });
      });
    });

    const crossLineAlliterations: AlliterationMatch[] = [];
    const processed = new Set<number>();

    for (let i = 0; i < allWords.length - 1; i++) {
      if (processed.has(i)) continue;

      const matchingWords: string[] = [allWords[i].word];
      const positions: number[] = [i];

      for (let j = i + 1; j < allWords.length && j < i + 10; j++) {
        try {
          if (this.rita.isRhyme(allWords[i].word, allWords[j].word)) {
            matchingWords.push(allWords[j].word);
            positions.push(j);
            processed.add(j);
          }
        } catch {
          continue;
        }
      }

      if (matchingWords.length > 2) {
        crossLineAlliterations.push({
          words: matchingWords,
          positions,
          sound: matchingWords[0][0],
        });
        processed.add(i);
      }
    }

    return crossLineAlliterations;
  }

  async assessRhymeQuality(word1: string, word2: string) {
    return this.rita.analyzeRhymeQuality(word1, word2);
  }

  detectRhymePattern(lines: string[]): { scheme: string; consistency: number } {
    const scheme = this.analyzeRhymeScheme(lines);
    const uniqueRhymes = new Set(scheme.split(''));
    const consistency = uniqueRhymes.size / scheme.length;

    return { scheme, consistency };
  }
}
