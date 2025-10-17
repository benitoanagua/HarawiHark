import { Injectable } from '@angular/core';
import { RiTa } from 'rita';

export interface SyllableAnalysis {
  syllables: number;
  breakdown: string[];
  stresses: string;
  phones: string;
}

export interface WordAnalysis {
  word: string;
  syllables: number;
  phones: string;
  pos: string;
  stresses: string;
}

export interface AlternativeWord {
  word: string;
  syllables: number;
  reason: 'exact-match' | 'rhyme-match' | 'sound-match';
  pos?: string;
}

export interface AlliterationMatch {
  words: string[];
  positions: number[];
  sound: string;
}

export interface RhymeMatch {
  word: string;
  rhymesWith: string[];
  perfectRhymes: string[];
  nearRhymes: string[];
}

@Injectable({
  providedIn: 'root',
})
export class RitaService {
  private readonly cache = new Map<string, SyllableAnalysis>();

  analyzeLine(line: string): SyllableAnalysis {
    const trimmedLine = line.trim();

    if (!trimmedLine) {
      return { syllables: 0, breakdown: [], stresses: '', phones: '' };
    }

    const cacheKey = `line:${trimmedLine}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    const words = RiTa.tokenize(trimmedLine).filter((word) => /[a-zA-Z]/.test(word));

    let totalSyllables = 0;
    const syllables: string[] = [];
    const stresses: string[] = [];
    const phones: string[] = [];

    words.forEach((word) => {
      const syllableStr = RiTa.syllables(word);
      const wordSyllables = syllableStr ? syllableStr.split('/') : [word];
      totalSyllables += wordSyllables.length;

      syllables.push(...wordSyllables);

      const wordPhones = RiTa.phones(word);
      if (wordPhones) {
        phones.push(wordPhones);
      } else {
        phones.push('');
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
      phones: phones.join(' '),
    };

    this.cache.set(cacheKey, result);
    return result;
  }

  analyzeWords(line: string): WordAnalysis[] {
    const words = RiTa.tokenize(line).filter((word) => /[a-zA-Z]/.test(word));

    return words.map((word) => {
      const syllableStr = RiTa.syllables(word);
      const syllableCount = syllableStr ? syllableStr.split('/').length : 0;
      const phones = RiTa.phones(word) || '';
      const pos = RiTa.pos(word)[0] || 'unknown';
      const stresses = RiTa.stresses(word) || '';

      return {
        word,
        syllables: syllableCount,
        phones,
        pos,
        stresses,
      };
    });
  }

  async suggestAlternatives(
    word: string,
    targetSyllables: number,
    maxResults = 10
  ): Promise<AlternativeWord[]> {
    const alternatives: AlternativeWord[] = [];

    try {
      const firstLetter = word[0].toLowerCase();
      const allWords = await RiTa.search(new RegExp(`^${firstLetter}`, 'i'));

      const exactMatches: string[] = [];
      for (const w of allWords.slice(0, 100)) {
        try {
          if (typeof w !== 'string') continue;

          const syllableCount = RiTa.syllables(w).split('/').length;
          if (syllableCount === targetSyllables && w.toLowerCase() !== word.toLowerCase()) {
            exactMatches.push(w);
            if (exactMatches.length >= 5) break;
          }
        } catch {
          continue;
        }
      }

      exactMatches.forEach((w: string) => {
        alternatives.push({
          word: w,
          syllables: targetSyllables,
          reason: 'exact-match',
          pos: RiTa.pos(w)[0],
        });
      });

      const rhymes = await RiTa.rhymes(word);
      for (const r of rhymes) {
        if (alternatives.length >= maxResults) break;
        try {
          if (typeof r !== 'string') continue;

          const rSyllables = RiTa.syllables(r).split('/').length;
          if (rSyllables === targetSyllables && r.toLowerCase() !== word.toLowerCase()) {
            alternatives.push({
              word: r,
              syllables: targetSyllables,
              reason: 'rhyme-match',
              pos: RiTa.pos(r)[0],
            });
          }
        } catch {
          continue;
        }
      }

      if (alternatives.length < maxResults) {
        const soundAlikes = await RiTa.soundsLike(word);
        for (const s of soundAlikes) {
          if (alternatives.length >= maxResults) break;
          try {
            if (typeof s !== 'string') continue;

            const sSyllables = RiTa.syllables(s).split('/').length;
            if (sSyllables === targetSyllables && s.toLowerCase() !== word.toLowerCase()) {
              alternatives.push({
                word: s,
                syllables: targetSyllables,
                reason: 'sound-match',
                pos: RiTa.pos(s)[0],
              });
            }
          } catch {
            continue;
          }
        }
      }
    } catch (error) {
      console.warn('Error finding alternatives:', error);
    }

    const uniqueAlternatives = alternatives.filter(
      (alt, index, self) =>
        index === self.findIndex((a) => a.word.toLowerCase() === alt.word.toLowerCase())
    );

    return uniqueAlternatives.slice(0, maxResults);
  }

  detectAlliterations(line: string): AlliterationMatch[] {
    const words = RiTa.tokenize(line).filter((word) => /[a-zA-Z]/.test(word));
    const alliterations: AlliterationMatch[] = [];

    for (let i = 0; i < words.length - 1; i++) {
      try {
        if (RiTa.isAlliteration(words[i], words[i + 1])) {
          const matchingWords = [words[i], words[i + 1]];
          const positions = [i, i + 1];
          let j = i + 2;

          while (j < words.length && RiTa.isAlliteration(words[i], words[j])) {
            matchingWords.push(words[j]);
            positions.push(j);
            j++;
          }

          const phones = RiTa.phones(words[i]);
          const sound = phones ? phones.split('-')[0] : words[i][0];

          alliterations.push({
            words: matchingWords,
            positions,
            sound,
          });

          i = j - 1;
        }
      } catch {
        continue;
      }
    }

    return alliterations;
  }

  async findRhymes(word: string, targetSyllables?: number): Promise<RhymeMatch> {
    try {
      const allRhymes = await RiTa.rhymes(word);
      const soundAlikes = await RiTa.soundsLike(word);

      let perfectRhymes = allRhymes.filter((r: unknown) => typeof r === 'string');
      let nearRhymes = soundAlikes.filter(
        (s: unknown) => typeof s === 'string' && !allRhymes.includes(s)
      );

      if (targetSyllables !== undefined) {
        perfectRhymes = perfectRhymes.filter((r: string) => {
          try {
            const syllables = RiTa.syllables(r).split('/').length;
            return syllables === targetSyllables;
          } catch {
            return false;
          }
        });

        nearRhymes = nearRhymes.filter((r: string) => {
          try {
            const syllables = RiTa.syllables(r).split('/').length;
            return syllables === targetSyllables;
          } catch {
            return false;
          }
        });
      }

      return {
        word,
        rhymesWith: [...perfectRhymes, ...nearRhymes].slice(0, 20),
        perfectRhymes: perfectRhymes.slice(0, 10),
        nearRhymes: nearRhymes.slice(0, 10),
      };
    } catch (error) {
      console.warn('Error finding rhymes:', error);
      return {
        word,
        rhymesWith: [],
        perfectRhymes: [],
        nearRhymes: [],
      };
    }
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
    const analysis = this.analyzeLine(line);
    const currentSyllables = analysis.syllables;
    const difference = targetSyllables - currentSyllables;

    if (difference === 0) {
      return ['✓ Perfect! This line matches the target syllable count.'];
    }

    const suggestions: string[] = [];

    if (difference > 0) {
      suggestions.push(`Add ${difference} syllable${difference > 1 ? 's' : ''} to this line.`);
      suggestions.push('Try adding descriptive adjectives or adverbs.');

      const words = this.analyzeWords(line);
      const shortWords = words.filter((w) => w.syllables === 1);
      if (shortWords.length > 0) {
        suggestions.push(
          `Consider replacing short words like "${shortWords[0].word}" with longer alternatives.`
        );
      }
    } else {
      const absDiff = Math.abs(difference);
      suggestions.push(`Remove ${absDiff} syllable${absDiff > 1 ? 's' : ''} from this line.`);
      suggestions.push('Try using shorter words or removing unnecessary words.');

      const words = this.analyzeWords(line);
      const longWords = words
        .filter((w) => w.syllables > 2)
        .sort((a, b) => b.syllables - a.syllables);
      if (longWords.length > 0) {
        suggestions.push(
          `Consider replacing "${longWords[0].word}" (${longWords[0].syllables} syllables) with a shorter alternative.`
        );
      }
    }

    return suggestions;
  }

  private getLastWord(line: string): string {
    const words = RiTa.tokenize(line).filter((word) => /[a-zA-Z]/.test(word));
    return words[words.length - 1]?.toLowerCase() || '';
  }

  clearCache(): void {
    this.cache.clear();
  }
}
