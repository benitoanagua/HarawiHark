import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CardComponent } from '../card/card.component';
import { BadgeComponent } from '../badge/badge.component';
import { ButtonComponent } from '../button/button.component';
import type { AlternativeWord } from '../../services/rita.service';

export interface WordSuggestionData {
  original: string;
  currentSyllables: number;
  targetSyllables: number;
  alternatives: AlternativeWord[];
}

@Component({
  selector: 'app-word-suggestions',
  standalone: true,
  imports: [CardComponent, BadgeComponent, ButtonComponent],
  templateUrl: './word-suggestions.component.html',
})
export class WordSuggestionsComponent {
  @Input({ required: true }) data!: WordSuggestionData;
  @Output() replaceWord = new EventEmitter<string>();
  @Output() closeSuggestions = new EventEmitter<void>();

  getReasonLabel(reason: string): string {
    const labels: Record<string, string> = {
      'exact-match': 'exact syllables',
      'rhyme-match': 'rhymes with original',
      'sound-match': 'similar sound',
    };
    return labels[reason] || reason;
  }

  getReasonVariant(reason: string): 'success' | 'info' | 'default' {
    if (reason === 'exact-match') return 'success';
    if (reason === 'rhyme-match') return 'info';
    return 'default';
  }

  onReplaceWord(word: string): void {
    this.replaceWord.emit(word);
  }
}
