import { Injectable, inject, signal } from '@angular/core';
import { PoetryAnalysisService } from './poetry-analysis.service';
import { PoetrySuggestionsService } from './poetry-suggestions.service';
import { PoetryPatternsService } from './poetry-patterns.service';
import { RhymeAnalysisService } from './rhyme-analysis.service';
import { PoemQualityService, type QualityMetrics } from './poem-quality.service';
import { PoemGeneratorService } from './poem-generator.service';
import {
  RitaService,
  type GrammaticalAnalysis,
  type AlliterationMatch,
  type AlternativeWord,
} from './rita.service';
import { POETRY_FORMS, POETRY_EXAMPLES } from '../../data/poetry-forms.data';
import type { LineAnalysis } from '../../models/poetry.model';

export interface EnhancedLineAnalysis extends LineAnalysis {
  words: {
    word: string;
    syllables: number;
    pos: string;
    phones: string;
    grammar?: GrammaticalAnalysis;
  }[];
  alliterations?: AlliterationMatch[];
  typos?: {
    line: number;
    word: string;
    suggestions: string[];
  }[];
}

export interface EnhancedPoetryResult {
  ok: boolean;
  form: string;
  totalLines: {
    expected: number;
    actual: number;
  };
  lines: EnhancedLineAnalysis[];
  summary: string;
  rhymeScheme?: string;
  suggestions: string[];
  overallAlliterations: AlliterationMatch[];
  detectedPatterns: string[];
  typos?: {
    line: number;
    word: string;
    suggestions: string[];
  }[];
}

export interface WordSuggestionData {
  original: string;
  currentSyllables: number;
  targetSyllables: number;
  alternatives: AlternativeWord[];
}

@Injectable({
  providedIn: 'root',
})
export class PoetryAnalyzerService {
  private readonly analysis = inject(PoetryAnalysisService);
  private readonly suggestions = inject(PoetrySuggestionsService);
  private readonly patterns = inject(PoetryPatternsService);
  private readonly rhymes = inject(RhymeAnalysisService);
  private readonly quality = inject(PoemQualityService);
  private readonly generator = inject(PoemGeneratorService);
  private readonly rita = inject(RitaService);

  readonly isLoading = signal(false);
  readonly result = signal<EnhancedPoetryResult | null>(null);
  readonly selectedWord = signal<string | null>(null);
  readonly wordAlternatives = signal<WordSuggestionData | null>(null);
  readonly generatedPoem = signal<string[] | null>(null);
  readonly qualityMetrics = signal<QualityMetrics | null>(null);
  readonly poemVariations = signal<string[][]>([]);
  readonly selectedForm = signal<string>('haiku');
  readonly poemText = signal<string>('');

  async generatePoem(formId: string): Promise<void> {
    this.isLoading.set(true);

    try {
      const poem = await this.generator.generatePoem(formId);
      this.generatedPoem.set(poem);

      if (poem.length > 0) {
        await this.analyze(formId, poem);
      }
    } catch (error) {
      console.error('Error generating poem:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  async generateVariations(): Promise<void> {
    const currentResult = this.result();
    if (!currentResult) return;

    this.isLoading.set(true);
    const variations: string[][] = [];

    try {
      for (const line of currentResult.lines) {
        const lineVariations = await this.generator.generateVariations(line.text, line.expected);
        variations.push(lineVariations);
      }

      this.poemVariations.set(variations);
    } catch (error) {
      console.error('Error generating variations:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  assessQuality(): void {
    const result = this.result();
    if (!result) return;

    const lines = result.lines.map((l) => l.text);
    const pattern = POETRY_FORMS[result.form].pattern;

    const metrics = this.quality.assessQuality(lines, pattern, result);
    this.qualityMetrics.set(metrics);
  }

  async analyze(formKey: string, rawLines: string[]): Promise<EnhancedPoetryResult> {
    this.isLoading.set(true);

    try {
      const form = POETRY_FORMS[formKey];
      if (!form) {
        throw new Error(`Unknown form "${formKey}"`);
      }

      const lines = rawLines.map((line) => line.trim()).filter((line) => line.length > 0);
      const typos = await this.rita.detectTypos(lines);

      const lineAnalyses: EnhancedLineAnalysis[] = await Promise.all(
        lines.map(async (line, index) => {
          const analysis = this.rita.analyzeLine(line);
          const words = this.rita.analyzeWords(line);
          const alliterations = this.rita.detectAlliterations(line);
          const expected = form.pattern[index] ?? 0;

          const wordsWithGrammar = words.map((word) => ({
            ...word,
            grammar: this.rita.analyzeGrammar(word.word),
          }));

          return {
            text: line,
            count: analysis.syllables,
            expected,
            match: analysis.syllables === expected,
            syllables: analysis.breakdown,
            stresses: analysis.stresses,
            words: wordsWithGrammar,
            alliterations: alliterations.length > 0 ? alliterations : undefined,
            typos: typos.filter((t) => t.line === index),
          };
        })
      );

      const quality = this.quality.assessQuality(lines, form.pattern, {
        ok: lineAnalyses.every((l) => l.match),
        form: formKey,
        totalLines: { expected: form.pattern.length, actual: lineAnalyses.length },
        lines: lineAnalyses,
        summary: '',
        rhymeScheme: undefined,
        suggestions: [],
        overallAlliterations: [],
        detectedPatterns: [],
      });

      const overallAlliterations = this.rhymes.detectCrossLineAlliterations(lines);
      const detectedPatterns = this.detectPatterns(lineAnalyses);

      const ok = lineAnalyses.length === form.pattern.length && lineAnalyses.every((l) => l.match);

      const mismatches = lineAnalyses.filter((l) => !l.match).length;
      const summary = ok
        ? `Perfect match: all ${lineAnalyses.length} lines follow the ${form.pattern.join(
            '-'
          )} pattern`
        : `${mismatches} of ${lineAnalyses.length} lines don't match the expected pattern`;

      const suggestions = this.generateEnhancedSuggestions(lineAnalyses, form.pattern);
      const rhymeScheme = lines.length > 1 ? this.rita.analyzeRhymeScheme(lines) : undefined;

      const result: EnhancedPoetryResult = {
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
        overallAlliterations,
        detectedPatterns,
        typos: typos.length > 0 ? typos : undefined,
      };

      this.result.set(result);
      this.qualityMetrics.set(quality);
      return result;
    } finally {
      this.isLoading.set(false);
    }
  }

  async selectWordEnhanced(word: string | null): Promise<void> {
    this.selectedWord.set(word);
    this.wordAlternatives.set(null);

    if (!word) return;

    const result = this.result();
    if (!result) return;

    for (const line of result.lines) {
      const wordAnalysis = line.words.find((w) => w.word.toLowerCase() === word.toLowerCase());

      if (wordAnalysis) {
        const targetSyllables = line.expected;
        const currentLineSyllables = line.count;
        const diff = targetSyllables - currentLineSyllables;
        const neededSyllables = wordAnalysis.syllables + diff;

        if (neededSyllables > 0) {
          try {
            const alternatives = await this.suggestions.getEnhancedAlternatives(
              word,
              neededSyllables
            );
            this.wordAlternatives.set({
              original: word,
              currentSyllables: wordAnalysis.syllables,
              targetSyllables: neededSyllables,
              alternatives,
            });
          } catch (error) {
            console.warn('Error getting enhanced alternatives:', error);
          }
        }
        break;
      }
    }
  }

  async selectWord(word: string | null): Promise<void> {
    this.selectedWord.set(word);
    this.wordAlternatives.set(null);

    if (!word) {
      return;
    }

    const result = this.result();
    if (!result) return;

    for (const line of result.lines) {
      const wordAnalysis = line.words.find((w) => w.word.toLowerCase() === word.toLowerCase());
      if (wordAnalysis) {
        const targetSyllables = line.expected;
        const currentLineSyllables = line.count;
        const diff = targetSyllables - currentLineSyllables;
        const neededSyllables = wordAnalysis.syllables + diff;

        if (neededSyllables > 0) {
          try {
            const alternatives = await this.rita.suggestAlternatives(word, neededSyllables, 8);
            this.wordAlternatives.set({
              original: word,
              currentSyllables: wordAnalysis.syllables,
              targetSyllables: neededSyllables,
              alternatives,
            });
          } catch (error) {
            console.warn('Error getting word alternatives:', error);
          }
        }
        break;
      }
    }
  }

  clear(): void {
    this.result.set(null);
    this.selectedWord.set(null);
    this.wordAlternatives.set(null);
  }

  loadExample(): void {
    const formId = this.selectedForm();
    const example = POETRY_EXAMPLES[formId];
    if (example) {
      this.poemText.set(example.join('\n'));
    }
  }

  private detectPatterns(lines: EnhancedLineAnalysis[]): string[] {
    const patterns: string[] = [];

    const stressPatterns = lines.map((l) => l.stresses).filter((s) => s);
    if (stressPatterns.length > 2) {
      const firstPattern = stressPatterns[0];
      const allSame = stressPatterns.every((p) => p === firstPattern);
      if (allSame) {
        patterns.push(`Consistent stress pattern: ${firstPattern}`);
      }
    }

    const linesWithAlliteration = lines.filter(
      (l) => l.alliterations && l.alliterations.length > 0
    );
    if (linesWithAlliteration.length > 0) {
      patterns.push(
        `${linesWithAlliteration.length} line${
          linesWithAlliteration.length > 1 ? 's' : ''
        } contain alliteration`
      );
    }

    const allWords = lines.flatMap((l) => l.words);
    const nouns = allWords.filter((w) => w.pos.startsWith('nn')).length;
    const verbs = allWords.filter((w) => w.pos.startsWith('vb')).length;
    const adjectives = allWords.filter((w) => w.pos.startsWith('jj')).length;

    if (nouns > verbs * 2) {
      patterns.push('Noun-heavy composition (descriptive style)');
    } else if (verbs > nouns * 1.5) {
      patterns.push('Verb-heavy composition (active style)');
    }

    if (adjectives > allWords.length * 0.2) {
      patterns.push('High use of adjectives (vivid imagery)');
    }

    const avgWordLength =
      allWords.reduce((sum, w) => sum + w.word.length, 0) / (allWords.length || 1);
    if (avgWordLength > 6) {
      patterns.push('Complex vocabulary (long words)');
    } else if (avgWordLength < 4) {
      patterns.push('Simple vocabulary (short words)');
    }

    return patterns;
  }

  private generateEnhancedSuggestions(
    lineAnalyses: EnhancedLineAnalysis[],
    pattern: number[]
  ): string[] {
    const suggestions: string[] = [];

    if (lineAnalyses.length < pattern.length) {
      const missing = pattern.length - lineAnalyses.length;
      suggestions.push(`Add ${missing} more line${missing > 1 ? 's' : ''} to complete the pattern`);
    } else if (lineAnalyses.length > pattern.length) {
      const extra = lineAnalyses.length - pattern.length;
      suggestions.push(`Remove ${extra} line${extra > 1 ? 's' : ''} to match the pattern`);
    }

    lineAnalyses.forEach((line, index) => {
      if (!line.match && index < pattern.length) {
        const lineSuggestions = this.rita.generateSuggestions(line.text, pattern[index]);
        suggestions.push(`Line ${index + 1}: ${lineSuggestions[0]}`);

        const diff = pattern[index] - line.count;
        if (diff > 0) {
          const shortWords = line.words.filter((w) => w.syllables === 1);
          if (shortWords.length > 0) {
            suggestions.push(`  → Try replacing "${shortWords[0].word}" with a longer synonym`);
          }
        } else if (diff < 0) {
          const longWords = line.words
            .filter((w) => w.syllables > 2)
            .sort((a, b) => b.syllables - a.syllables);
          if (longWords.length > 0) {
            suggestions.push(
              `  → Try replacing "${longWords[0].word}" (${longWords[0].syllables} syllables) with a shorter word`
            );
          }
        }
      }
    });

    const linesWithAlliteration = lineAnalyses.filter(
      (l) => l.alliterations && l.alliterations.length > 0
    );
    if (linesWithAlliteration.length === 0 && lineAnalyses.length > 2) {
      suggestions.push('Consider adding alliteration for poetic effect');
    }

    return suggestions.slice(0, 5);
  }
}
