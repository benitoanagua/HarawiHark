import { Injectable } from '@angular/core';
import { RiTa } from 'rita';
import { EnhancedPoetryResult } from './poetry-analyzer.service';

export interface QualityMetrics {
  score: number;
  breakdown: {
    syllableAccuracy: number;
    phoneticsRichness: number;
    vocabularyDiversity: number;
    rhythmConsistency: number;
    rhetoricalDevices: number;
  };
  strengths: string[];
  improvements: string[];
  grade: 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D' | 'F';
}

@Injectable({
  providedIn: 'root',
})
export class PoemQualityService {
  assessQuality(lines: string[], pattern: number[], result: EnhancedPoetryResult): QualityMetrics {
    const metrics = {
      syllableAccuracy: this.calculateSyllableAccuracy(result, pattern),
      phoneticsRichness: this.calculatePhoneticRichness(lines),
      vocabularyDiversity: this.calculateVocabularyDiversity(lines),
      rhythmConsistency: this.calculateRhythmConsistency(result),
      rhetoricalDevices: this.calculateRhetoricalDevices(result),
    };

    const score = this.computeOverallScore(metrics);
    const grade = this.assignGrade(score);
    const strengths = this.identifyStrengths(metrics);
    const improvements = this.suggestImprovements(metrics);

    return {
      score,
      breakdown: metrics,
      strengths,
      improvements,
      grade,
    };
  }

  private calculateSyllableAccuracy(result: EnhancedPoetryResult, pattern: number[]): number {
    if (result.lines.length !== pattern.length) return 0;

    const matches = result.lines.filter((line) => line.match).length;
    return (matches / pattern.length) * 100;
  }

  private calculatePhoneticRichness(lines: string[]): number {
    const text = lines.join(' ');
    const words = RiTa.tokens(text);

    if (words.length === 0) return 0;

    const uniquePhonemes = new Set<string>();
    words.forEach((word) => {
      const phones = RiTa.phones(word);
      if (phones) {
        phones.split('-').forEach((p) => uniquePhonemes.add(p));
      }
    });

    // Normalizado: más de 15 fonemas únicos = 100%
    return Math.min(100, (uniquePhonemes.size / 15) * 100);
  }

  private calculateVocabularyDiversity(lines: string[]): number {
    const text = lines.join(' ');
    const tokens = RiTa.tokenize(text);
    const words = tokens.filter((t) => !RiTa.isPunct(t));

    if (words.length === 0) return 0;

    const unique = new Set(words.map((w) => w.toLowerCase()));

    // Type-Token Ratio (TTR)
    const ttr = unique.size / words.length;

    // Normalizado: TTR > 0.6 es bueno para poesía
    return Math.min(100, (ttr / 0.6) * 100);
  }

  private calculateRhythmConsistency(result: EnhancedPoetryResult): number {
    const stressPatterns = result.lines
      .map((l) => l.stresses)
      .filter((s): s is string => s !== undefined && s.length > 0); // Type guard

    if (stressPatterns.length < 2) return 50;

    // Verifica similitud entre patrones de estrés
    const firstPattern = stressPatterns[0];
    const similarCount = stressPatterns.filter(
      (p) => this.stressSimilarity(firstPattern, p) > 0.6
    ).length;

    return (similarCount / stressPatterns.length) * 100;
  }

  private calculateRhetoricalDevices(result: EnhancedPoetryResult): number {
    let score = 0;

    // Aliteración (+20 puntos)
    if (result.overallAlliterations.length > 0) {
      score += Math.min(20, result.overallAlliterations.length * 5);
    }

    // Rima (+30 puntos)
    if (result.rhymeScheme && result.rhymeScheme !== 'A'.repeat(result.lines.length)) {
      score += 30;
    }

    // Repetición intencional (+20 puntos)
    const concordance = RiTa.concordance(result.lines.map((l) => l.text).join(' '));
    const repeatedWords = Object.values(concordance).filter((count) => count > 1).length;
    if (repeatedWords > 0) {
      score += Math.min(20, repeatedWords * 4);
    }

    // Variedad de POS (+15 puntos)
    const allWords = result.lines.flatMap((l) => l.words);
    const uniquePOS = new Set(allWords.map((w) => w.pos));
    if (uniquePOS.size >= 4) {
      score += 15;
    }

    // Imágenes sensoriales (+15 puntos)
    const sensoryWords = this.countSensoryWords(allWords.map((w) => w.word));
    if (sensoryWords >= 3) {
      score += 15;
    }

    return Math.min(100, score);
  }

  private computeOverallScore(metrics: QualityMetrics['breakdown']): number {
    const weights = {
      syllableAccuracy: 0.35,
      phoneticsRichness: 0.15,
      vocabularyDiversity: 0.2,
      rhythmConsistency: 0.15,
      rhetoricalDevices: 0.15,
    };

    return Object.entries(weights).reduce((total, [key, weight]) => {
      return total + metrics[key as keyof typeof metrics] * weight;
    }, 0);
  }

  private assignGrade(score: number): QualityMetrics['grade'] {
    if (score >= 95) return 'A+';
    if (score >= 90) return 'A';
    if (score >= 85) return 'B+';
    if (score >= 80) return 'B';
    if (score >= 75) return 'C+';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  }

  private identifyStrengths(metrics: QualityMetrics['breakdown']): string[] {
    const strengths: string[] = [];

    if (metrics.syllableAccuracy === 100) {
      strengths.push('Perfect syllable matching');
    } else if (metrics.syllableAccuracy >= 80) {
      strengths.push('Good syllable accuracy');
    }

    if (metrics.phoneticsRichness > 80) {
      strengths.push('Rich phonetic variety');
    }

    if (metrics.vocabularyDiversity > 75) {
      strengths.push('Diverse vocabulary');
    }

    if (metrics.rhythmConsistency > 80) {
      strengths.push('Consistent rhythm');
    }

    if (metrics.rhetoricalDevices > 70) {
      strengths.push('Strong use of literary devices');
    }

    return strengths.length > 0 ? strengths : ['Good foundation - keep practicing!'];
  }

  private suggestImprovements(metrics: QualityMetrics['breakdown']): string[] {
    const improvements: string[] = [];

    if (metrics.syllableAccuracy < 100) {
      improvements.push('Adjust syllable counts to match the pattern');
    }

    if (metrics.phoneticsRichness < 60) {
      improvements.push('Use more varied sounds and phonemes');
    }

    if (metrics.vocabularyDiversity < 50) {
      improvements.push('Avoid repeating the same words');
    }

    if (metrics.rhythmConsistency < 60) {
      improvements.push('Create more consistent stress patterns');
    }

    if (metrics.rhetoricalDevices < 50) {
      improvements.push('Add alliteration, rhyme, or other literary devices');
    }

    return improvements.length > 0
      ? improvements
      : ['Excellent work! Consider experimenting with more complex forms.'];
  }

  private stressSimilarity(pattern1: string, pattern2: string): number {
    const arr1 = pattern1.split('/');
    const arr2 = pattern2.split('/');
    const maxLen = Math.max(arr1.length, arr2.length);

    let matches = 0;
    for (let i = 0; i < maxLen; i++) {
      if (arr1[i] === arr2[i]) matches++;
    }

    return matches / maxLen;
  }

  private countSensoryWords(words: string[]): number {
    const sensoryPatterns = [
      /bright|dark|color|hue|shade/i, // visual
      /loud|quiet|sound|music|voice|echo/i, // auditory
      /soft|hard|smooth|rough|warm|cold/i, // tactile
      /sweet|bitter|fragrant|scent|smell/i, // olfactory
      /taste|flavor|savory|delicious/i, // gustatory
    ];

    return words.filter((word) => sensoryPatterns.some((pattern) => pattern.test(word))).length;
  }
}
