import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  private readonly posLabels: Record<string, string> = {
    // Nouns
    nn: 'noun',
    nns: 'noun (plural)',
    nnp: 'proper noun',
    nnps: 'proper noun (plural)',

    // Verbs
    vb: 'verb',
    vbd: 'verb (past)',
    vbg: 'verb (gerund)',
    vbn: 'verb (past participle)',
    vbp: 'verb (present)',
    vbz: 'verb (3rd person)',

    // Adjectives
    jj: 'adjective',
    jjr: 'adjective (comparative)',
    jjs: 'adjective (superlative)',

    // Adverbs
    rb: 'adverb',
    rbr: 'adverb (comparative)',
    rbs: 'adverb (superlative)',

    // Determiners
    dt: 'determiner',
    wdt: 'wh-determiner',
    pdt: 'predeterminer',

    // Prepositions
    in: 'preposition',

    // Conjunctions
    cc: 'conjunction',

    // Pronouns
    prp: 'pronoun',
    prp$: 'possessive pronoun',
    wp: 'wh-pronoun',
    wp$: 'possessive wh-pronoun',

    // Interjections
    uh: 'interjection',

    // Particles
    rp: 'particle',

    // Other
    cd: 'cardinal number',
    ex: 'existential there',
    fw: 'foreign word',
    ls: 'list marker',
    md: 'modal',
    pos: 'possessive ending',
    sym: 'symbol',
    to: 'to',
    punc: 'punctuation',
  };

  getPosLabel(pos: string): string {
    return this.posLabels[pos.toLowerCase()] || pos;
  }

  getAllPosLabels(): Record<string, string> {
    return { ...this.posLabels };
  }
}
