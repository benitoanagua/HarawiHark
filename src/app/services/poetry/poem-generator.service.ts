import { Injectable } from '@angular/core';
import { RiTa } from 'rita';
import { POETRY_FORMS, POETRY_EXAMPLES } from '../../data/poetry-forms.data';

interface MarkovModel {
  generate: (options?: {
    minLength?: number;
    maxLength?: number;
    temperature?: number;
    allowDuplicates?: boolean;
    seed?: string | string[];
  }) => string;
  addText: (text: string) => void;
}

type GrammarRules = Record<string, string | string[]>;

interface GrammarInstance {
  expand: (ruleName?: string) => string;
}

@Injectable({
  providedIn: 'root',
})
export class PoemGeneratorService {
  private markovModels = new Map<string, MarkovModel>();
  private grammarCache = new Map<string, GrammarInstance>();

  /**
   * Generación híbrida: combina Markov (70%) con Grammar (30%)
   */
  async generatePoem(formId: string, examples?: string[]): Promise<string[]> {
    const form = POETRY_FORMS[formId];
    const lines: string[] = [];

    // Obtener o crear modelos
    const markovModel = this.getOrCreateMarkovModel(formId, examples);
    const grammar = this.getOrCreateGrammar(formId);

    for (let i = 0; i < form.lines; i++) {
      const targetSyllables = form.pattern[i];

      // 70% Markov, 30% Grammar (más control estructural)
      const useMarkov = Math.random() < 0.7;

      let line: string;
      if (useMarkov && markovModel) {
        line = await this.generateLineWithMarkov(markovModel, targetSyllables);
      } else if (grammar) {
        line = this.generateLineWithGrammar(grammar, i, targetSyllables);
      } else {
        line = this.getFallbackLine(formId, i);
      }

      lines.push(line || this.getFallbackLine(formId, i));
    }

    return lines;
  }

  /**
   * Obtiene o crea el modelo Markov para una forma
   */
  private getOrCreateMarkovModel(formId: string, examples?: string[]): MarkovModel | null {
    const key = `markov_${formId}`;

    if (!this.markovModels.has(key)) {
      try {
        const rm = RiTa.markov(2, {
          maxLengthMatch: 8,
          maxAttempts: 50,
        }) as MarkovModel;

        const trainingData = examples || POETRY_EXAMPLES[formId] || [];
        if (trainingData.length === 0) return null;

        trainingData.forEach((example) => rm.addText(example));
        this.markovModels.set(key, rm);
      } catch {
        console.warn('Failed to create Markov model for form:', formId);
        return null;
      }
    }

    return this.markovModels.get(key) || null;
  }

  /**
   * Obtiene o crea la gramática para una forma poética
   */
  private getOrCreateGrammar(formId: string): GrammarInstance | null {
    if (this.grammarCache.has(formId)) {
      return this.grammarCache.get(formId) || null;
    }

    const rules = this.getGrammarRulesForForm(formId);
    if (!rules) return null;

    try {
      const grammar = RiTa.grammar(rules) as GrammarInstance;
      this.grammarCache.set(formId, grammar);
      return grammar;
    } catch {
      console.warn('Failed to create grammar for form:', formId);
      return null;
    }
  }

  /**
   * Define gramáticas específicas por forma poética
   */
  private getGrammarRulesForForm(formId: string): GrammarRules | null {
    const grammars: Record<string, GrammarRules> = {
      haiku: {
        start: '$line0',
        line0: '$nature $action',
        line1: '$season $emotion $place',
        line2: '$nature $moment',
        nature: '[old pond | cherry tree | autumn moon | winter wind | spring rain]',
        action: '[waits | rests | falls | rises | flows]',
        season: '[in spring | in summer | in autumn | in winter]',
        emotion: '[peace | silence | beauty | wonder]',
        place: '[descends | arrives | appears | deepens]',
        moment: '[breaks the silence | marks the time | fills the space]',
      },

      tanka: {
        start: '$line0',
        line0: '$image $verb',
        line1: '$nature $action $place',
        line2: '$emotion $moment',
        line3: '$extended $feeling',
        line4: '$closing $sentiment',
        image: '[moonlight | starlight | sunbeam | shadow]',
        verb: '[falls | shines | dances | glows]',
        nature: '[gentle wind | soft rain | quiet snow]',
        action: '[whispers through | drifts across]',
        place: '[the garden | the valley | the mountains]',
        emotion: '[loneliness | tranquility | joy]',
        moment: '[profound | deep | eternal]',
        extended: '[in this moment of | through the depths of]',
        feeling: '[solitude | peace | wonder | grace]',
        closing: '[my heart | time itself | memory]',
        sentiment: '[remains | endures | transforms | grows]',
      },
    };

    return grammars[formId] || null;
  }

  /**
   * Genera una línea usando el modelo Markov con control de sílabas
   */
  private async generateLineWithMarkov(
    model: MarkovModel,
    targetSyllables: number,
    maxAttempts = 25
  ): Promise<string> {
    for (let attempts = 0; attempts < maxAttempts; attempts++) {
      try {
        const candidate = model.generate({
          minLength: 3,
          maxLength: 40,
          temperature: 1.5,
        });

        if (candidate) {
          const analysis = RiTa.analyze(candidate) as { syllables: string };
          const syllableCount = analysis.syllables.split('/').length;

          // Aceptar si está cerca del objetivo (±1 sílaba)
          if (Math.abs(syllableCount - targetSyllables) <= 1) {
            return candidate;
          }
        }
      } catch {
        // Continuar con el siguiente intento
        continue;
      }
    }
    return '';
  }

  /**
   * Genera una línea usando la gramática con validación de sílabas
   */
  private generateLineWithGrammar(
    grammar: GrammarInstance,
    lineIndex: number,
    targetSyllables: number
  ): string {
    try {
      const ruleName = `line${lineIndex}`;

      // Intentar expandir la regla específica
      const line = grammar.expand(ruleName);

      // Verificar que las sílabas estén cerca del objetivo
      const analysis = RiTa.analyze(line) as { syllables: string };
      const syllableCount = analysis.syllables.split('/').length;

      if (Math.abs(syllableCount - targetSyllables) <= 2) {
        return line;
      }

      // Si no coincide, intentar con 'start' como fallback
      return grammar.expand();
    } catch {
      console.warn('Grammar expansion failed for line:', lineIndex);
      return '';
    }
  }

  /**
   * Generación de variaciones más robusta
   */
  async generateVariations(line: string, targetSyllables: number): Promise<string[]> {
    const variations: string[] = [];

    try {
      const rm = RiTa.markov(2, {
        maxLengthMatch: 5,
        maxAttempts: 20,
      }) as MarkovModel;

      // Agregar contexto enriquecido
      rm.addText(line);
      rm.addText(line);
      rm.addText(line);

      const words = line.split(' ');
      const similarPhrases = [
        line,
        words.slice(0, -1).join(' ') + ' softly',
        words.slice(0, -1).join(' ') + ' gently',
        words.slice(1).join(' '),
        words.reverse().join(' '),
      ];

      similarPhrases.forEach((phrase) => {
        if (phrase.trim()) {
          rm.addText(phrase);
        }
      });

      let attempts = 0;
      const maxTotalAttempts = 15;

      while (variations.length < 3 && attempts < maxTotalAttempts) {
        try {
          const candidate = rm.generate({
            maxLength: 50,
            temperature: 1.2,
          });

          if (candidate && candidate !== line) {
            const syllables = RiTa.syllables(candidate).split('/').length;

            if (Math.abs(syllables - targetSyllables) <= 1) {
              if (!variations.includes(candidate)) {
                variations.push(candidate);
              }
            }
          }
        } catch {
          console.warn(`Generation attempt ${attempts + 1} failed`);
        }

        attempts++;
      }
    } catch {
      console.warn('Error creating variations model');
    }

    if (variations.length === 0) {
      variations.push(...this.createSimpleVariations(line));
    }

    return variations.slice(0, 3);
  }

  /**
   * Variaciones simples como fallback
   */
  private createSimpleVariations(line: string): string[] {
    const words = line.split(' ').filter((w) => w.trim());
    const variations: string[] = [];

    if (words.length >= 3) {
      const reversed = [...words];
      [reversed[0], reversed[1]] = [reversed[1], reversed[0]];
      variations.push(reversed.join(' '));
    }

    const replacements: Record<string, string[]> = {
      the: ['a', 'one', 'this'],
      a: ['the', 'one', 'that'],
      and: ['with', 'plus', 'then'],
      in: ['on', 'at', 'by'],
      to: ['toward', 'into', 'unto'],
    };

    const variation2 = words.map((word) => {
      const lower = word.toLowerCase();
      if (replacements[lower]) {
        return replacements[lower][0];
      }
      return word;
    });

    if (variation2.join(' ') !== line) {
      variations.push(variation2.join(' '));
    }

    if (words.length >= 2) {
      const adjectives = ['gentle', 'quiet', 'soft', 'bright', 'sweet'];
      const randomAdj = adjectives[Math.floor(Math.random() * adjectives.length)];
      const variation3 = [words[0], randomAdj, ...words.slice(1)].join(' ');
      variations.push(variation3);
    }

    return variations.slice(0, 3);
  }

  /**
   * Líneas de fallback para cada forma
   */
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
