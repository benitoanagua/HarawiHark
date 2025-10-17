import { Injectable, inject, signal } from '@angular/core';
import { RiTa } from 'rita';
import {
  RitaService,
  type AlliterationMatch,
  type AlternativeWord,
  type GrammaticalAnalysis,
} from './rita.service';
import { PoemGeneratorService } from './poem-generator.service';
import { GrammarGeneratorService } from './grammar-generator.service';
import { PoemQualityService, QualityMetrics } from './poem-quality.service';
import { POETRY_FORMS, POETRY_EXAMPLES } from '../data/poetry-forms.data';
import type { LineAnalysis, PoetryResult } from '../models/poetry.model';

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

export interface EnhancedPoetryResult extends PoetryResult {
  lines: EnhancedLineAnalysis[];
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
  private readonly rita = inject(RitaService);
  private readonly poemGenerator = inject(PoemGeneratorService);
  private readonly grammarGenerator = inject(GrammarGeneratorService);
  private readonly poemQuality = inject(PoemQualityService);

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
      const poem = await this.poemGenerator.generatePoem(formId);
      this.generatedPoem.set(poem);

      // Analizar el poema generado automáticamente
      if (poem.length > 0) {
        await this.analyze(formId, poem);
      }
    } catch (error) {
      console.error('Error generating poem:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  /**
   * Generar variaciones del poema actual
   */
  async generateVariations(): Promise<void> {
    const currentResult = this.result();
    if (!currentResult) return;

    this.isLoading.set(true);
    const variations: string[][] = [];

    try {
      for (const line of currentResult.lines) {
        const lineVariations = await this.poemGenerator.generateVariations(
          line.text,
          line.expected
        );
        variations.push(lineVariations);
      }

      this.poemVariations.set(variations);
    } catch (error) {
      console.error('Error generating variations:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  /**
   * Evaluar calidad del poema
   */
  assessQuality(): void {
    const result = this.result();
    if (!result) return;

    const lines = result.lines.map((l) => l.text);
    const pattern = POETRY_FORMS[result.form].pattern;

    const metrics = this.poemQuality.assessQuality(lines, pattern, result);
    this.qualityMetrics.set(metrics);
  }

  /**
   * Mejorado: Análisis con características extendidas
   */
  async analyze(formKey: string, rawLines: string[]): Promise<EnhancedPoetryResult> {
    this.isLoading.set(true);

    try {
      const form = POETRY_FORMS[formKey];
      if (!form) {
        throw new Error(`Unknown form "${formKey}"`);
      }

      const lines = rawLines.map((line) => line.trim()).filter((line) => line.length > 0);

      // Análisis mejorado con detección de errores tipográficos
      const typos = await this.rita.detectTypos(lines);

      const lineAnalyses: EnhancedLineAnalysis[] = await Promise.all(
        lines.map(async (line, index) => {
          const analysis = this.rita.analyzeLine(line);
          const words = this.rita.analyzeWords(line);
          const alliterations = this.rita.detectAlliterations(line);
          const expected = form.pattern[index] ?? 0;

          // Análisis gramatical extendido para cada palabra
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

      // Análisis de calidad
      const quality = this.poemQuality.assessQuality(lines, form.pattern, {
        // Resultado básico para el cálculo de calidad
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

      const overallAlliterations = this.detectCrossLineAlliterations(lines);
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
        // quality, // Remover esta línea - quality no existe en EnhancedPoetryResult
        typos: typos.length > 0 ? typos : undefined,
      };

      this.result.set(result);
      this.qualityMetrics.set(quality);
      return result;
    } finally {
      this.isLoading.set(false);
    }
  }

  /**
   * Mejorado: Sugerencias de palabras con múltiples estrategias
   */
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
            // Estrategia 1: Alternativas básicas
            const basic = await this.rita.suggestAlternatives(word, neededSyllables, 5);

            // Estrategia 2: Rimas semánticas
            const semantic = await this.rita.findSemanticRhymes(word, neededSyllables);

            // Estrategia 3: Similitud ortográfica
            const spelling = await this.rita.findSpellingSuggestions(word, neededSyllables);

            // Estrategia 4: Variantes morfológicas
            const morphological = this.rita
              .suggestMorphologicalVariants(word)
              .map((w) => ({
                word: w,
                syllables: (RiTa.syllables(w) as string).split('/').length,
                reason: 'morphological' as const,
                pos: RiTa.pos(w)[0],
              }))
              .filter((w) => w.syllables === neededSyllables);

            // Combina y deduplica
            const allAlternatives = [...basic, ...semantic, ...spelling, ...morphological];

            const unique = allAlternatives.filter(
              (alt, idx, self) => idx === self.findIndex((a) => a.word === alt.word)
            );

            this.wordAlternatives.set({
              original: word,
              currentSyllables: wordAnalysis.syllables,
              targetSyllables: neededSyllables,
              alternatives: unique.slice(0, 12),
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

  private detectCrossLineAlliterations(lines: string[]): AlliterationMatch[] {
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

  private generateEnhancedSuggestions(lines: EnhancedLineAnalysis[], pattern: number[]): string[] {
    const suggestions: string[] = [];

    if (lines.length < pattern.length) {
      const missing = pattern.length - lines.length;
      suggestions.push(`Add ${missing} more line${missing > 1 ? 's' : ''} to complete the pattern`);
    } else if (lines.length > pattern.length) {
      const extra = lines.length - pattern.length;
      suggestions.push(`Remove ${extra} line${extra > 1 ? 's' : ''} to match the pattern`);
    }

    lines.forEach((line, index) => {
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

    const linesWithAlliteration = lines.filter(
      (l) => l.alliterations && l.alliterations.length > 0
    );
    if (linesWithAlliteration.length === 0 && lines.length > 2) {
      suggestions.push('Consider adding alliteration for poetic effect');
    }

    return suggestions.slice(0, 5);
  }
}
