import { Injectable, inject } from '@angular/core';
import { RitaService } from './rita.service';

export type MeterType = 'iambic' | 'trochaic' | 'anapestic' | 'dactylic' | 'irregular';

export interface MeterAnalysis {
  type: MeterType;
  consistency: number;
  pattern: string;
  description: string;
  examples: string[];
}

export interface RhythmSuggestion {
  line: number;
  current: string;
  issue: string;
  suggestion: string;
}

@Injectable({
  providedIn: 'root',
})
export class MeterAnalysisService {
  private readonly rita = inject(RitaService);

  detectMeter(lines: string[]): MeterAnalysis {
    const stressPatterns = lines
      .map((line) => this.rita.analyzeLine(line).stresses)
      .filter((s) => s && s.length > 0);

    if (stressPatterns.length === 0) {
      return this.getIrregularMeter();
    }

    const meterCounts = {
      iambic: 0,
      trochaic: 0,
      anapestic: 0,
      dactylic: 0,
    };

    stressPatterns.forEach((pattern) => {
      const stresses = pattern.split('/').map((s) => parseInt(s));
      const type = this.classifyStressPattern(stresses);
      if (type !== 'irregular') {
        meterCounts[type]++;
      }
    });

    const total = stressPatterns.length;
    const dominant = Object.entries(meterCounts).sort(([, a], [, b]) => b - a)[0];

    const [type, count] = dominant as [MeterType, number];
    const consistency = (count / total) * 100;

    if (consistency < 40) {
      return this.getIrregularMeter();
    }

    return {
      type,
      consistency,
      pattern: this.getMeterPattern(type),
      description: this.getMeterDescription(type),
      examples: this.getMeterExamples(type),
    };
  }

  private classifyStressPattern(stresses: number[]): MeterType {
    if (stresses.length < 2) return 'irregular';

    const pairs: string[] = [];
    for (let i = 0; i < stresses.length - 1; i++) {
      pairs.push(`${stresses[i]}${stresses[i + 1]}`);
    }

    const pairCounts = {
      '01': 0,
      '10': 0,
      '001': 0,
      '100': 0,
    };

    pairs.forEach((pair) => {
      if (pair === '01') pairCounts['01']++;
      if (pair === '10') pairCounts['10']++;
    });

    for (let i = 0; i < stresses.length - 2; i++) {
      const triplet = `${stresses[i]}${stresses[i + 1]}${stresses[i + 2]}`;
      if (triplet === '001') pairCounts['001']++;
      if (triplet === '100') pairCounts['100']++;
    }

    const max = Math.max(...Object.values(pairCounts));
    if (max === 0) return 'irregular';

    if (pairCounts['01'] === max) return 'iambic';
    if (pairCounts['10'] === max) return 'trochaic';
    if (pairCounts['001'] === max) return 'anapestic';
    if (pairCounts['100'] === max) return 'dactylic';

    return 'irregular';
  }

  generateRhythmSuggestions(lines: string[], targetMeter?: MeterType): RhythmSuggestion[] {
    const suggestions: RhythmSuggestion[] = [];
    const detectedMeter = this.detectMeter(lines);
    const target = targetMeter || detectedMeter.type;

    if (target === 'irregular') {
      return suggestions;
    }

    lines.forEach((line, index) => {
      const analysis = this.rita.analyzeLine(line);
      if (!analysis.stresses) return;

      const stresses = analysis.stresses.split('/').map((s) => parseInt(s));
      const lineType = this.classifyStressPattern(stresses);

      if (lineType !== target) {
        suggestions.push({
          line: index + 1,
          current: analysis.stresses,
          issue: `This line follows a ${lineType} pattern instead of ${target}`,
          suggestion: `Try restructuring to match the ${target} rhythm (${this.getMeterPattern(
            target
          )})`,
        });
      }
    });

    return suggestions;
  }

  private getMeterPattern(type: MeterType): string {
    const patterns: Record<MeterType, string> = {
      iambic: 'da-DUM (0/1)',
      trochaic: 'DUM-da (1/0)',
      anapestic: 'da-da-DUM (0/0/1)',
      dactylic: 'DUM-da-da (1/0/0)',
      irregular: 'mixed or free verse',
    };
    return patterns[type];
  }

  private getMeterDescription(type: MeterType): string {
    const descriptions: Record<MeterType, string> = {
      iambic: 'Most common in English poetry. Sounds natural and flowing.',
      trochaic: "Strong, emphatic rhythm. Common in children's verse.",
      anapestic: 'Galloping, energetic rhythm. Creates sense of movement.',
      dactylic: 'Falling rhythm. Rare in English, common in ancient Greek.',
      irregular: 'No consistent metrical pattern. Free verse or mixed meters.',
    };
    return descriptions[type];
  }

  private getMeterExamples(type: MeterType): string[] {
    const examples: Record<MeterType, string[]> = {
      iambic: [
        "Shall I compare thee to a summer's day?",
        'The curfew tolls the knell of parting day',
      ],
      trochaic: ['Tell me not in mournful numbers', 'Tiger, tiger, burning bright'],
      anapestic: ['Twas the night before Christmas', 'And the sound of a voice that is still'],
      dactylic: ['This is the forest primeval', 'Cannon to right of them'],
      irregular: ['Free verse has no set pattern', 'Modern poetry often breaks rules'],
    };
    return examples[type];
  }

  private getIrregularMeter(): MeterAnalysis {
    return {
      type: 'irregular',
      consistency: 0,
      pattern: 'mixed or free verse',
      description:
        'No consistent metrical pattern detected. This could be free verse or mixed meters.',
      examples: [],
    };
  }
}
