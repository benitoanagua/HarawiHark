// src/app/services/poem-generator.service.ts
import { Injectable } from '@angular/core';
import { RiTa } from 'rita';
import { POETRY_FORMS, POETRY_EXAMPLES } from '../data/poetry-forms.data';

// Definir interfaz basada en los tipos reales
interface MarkovModel {
  generate: (
    count: number,
    options?: {
      minLength?: number;
      maxLength?: number;
      temperature?: number;
      allowDuplicates?: boolean;
      seed?: string | string[];
    }
  ) => string[];
  addText: (text: string) => void;
}

@Injectable({
  providedIn: 'root',
})
export class PoemGeneratorService {
  private markovModels = new Map<string, MarkovModel>();

  /**
   * Genera un nuevo poema basado en ejemplos del mismo tipo
   */
  async generatePoem(formId: string, examples?: string[]): Promise<string[]> {
    const key = `markov_${formId}`;

    if (!this.markovModels.has(key)) {
      // RiTa.markov NO acepta temperature, solo maxLengthMatch, etc.
      const rm = RiTa.markov(2, {
        maxLengthMatch: 8,
        maxAttempts: 50,
      }) as MarkovModel;

      const trainingData = examples || POETRY_EXAMPLES[formId] || [];
      trainingData.forEach((example) => rm.addText(example));

      this.markovModels.set(key, rm);
    }

    const model = this.markovModels.get(key);
    const form = POETRY_FORMS[formId];
    const lines: string[] = [];

    for (let i = 0; i < form.lines; i++) {
      const targetSyllables = form.pattern[i];
      const line = await this.generateLineWithSyllables(model!, targetSyllables);
      lines.push(line || this.getFallbackLine(formId, i));
    }

    return lines;
  }

  /**
   * Genera variaciones de una línea específica
   */
  async generateVariations(line: string, targetSyllables: number): Promise<string[]> {
    const rm = RiTa.markov(2) as MarkovModel;
    rm.addText(line);

    const variations: string[] = [];

    for (let i = 0; i < 8; i++) {
      // RiMarkov.generate SÍ acepta temperature
      const generated = rm.generate(1, {
        maxLength: 35,
        temperature: 1.8, // ✅ Válido aquí
      });

      if (generated.length > 0) {
        const candidate = generated[0];
        const syllables = RiTa.syllables(candidate).split('/').length;
        if (syllables === targetSyllables && candidate !== line) {
          variations.push(candidate);
        }
      }

      if (variations.length >= 3) break;
    }

    return variations;
  }

  private async generateLineWithSyllables(
    model: MarkovModel,
    targetSyllables: number,
    maxAttempts = 25
  ): Promise<string> {
    for (let attempts = 0; attempts < maxAttempts; attempts++) {
      // RiMarkov.generate SÍ acepta temperature
      const candidates = model.generate(1, {
        minLength: 3,
        maxLength: 40,
        temperature: 1.5, // ✅ Válido aquí
      });

      if (candidates.length > 0) {
        const candidate = candidates[0];
        const analysis = RiTa.analyze(candidate) as { syllables: string };
        const syllableCount = analysis.syllables.split('/').length;

        if (syllableCount === targetSyllables) {
          return candidate;
        }
      }
    }
    return '';
  }

  private getFallbackLine(formId: string, lineIndex: number): string {
    const fallbacks: Record<string, string[]> = {
      haiku: ['A gentle breeze blows', 'Through the quiet forest deep', 'Peaceful silence grows'],
      tanka: [
        'Moonlight on the lake',
        'Reflecting stars in the night',
        'A solitary swan',
        "Glides across the water's face",
        'In the tranquil evening light',
      ],
      limerick: [
        'There once was a poet so bright',
        'Who wrote verses both day and night',
        'With rhythm and rhyme',
        'They marked the right time',
        'And filled all their readers with light',
      ],
      cinquain: [
        'Moon',
        'Silver light',
        'Casting gentle glow',
        'Illuminating the dark night sky',
        'Peace',
      ],
    };

    return (
      fallbacks[formId]?.[lineIndex] ||
      `Line ${lineIndex + 1} with ${POETRY_FORMS[formId].pattern[lineIndex]} syllables`
    );
  }
}
