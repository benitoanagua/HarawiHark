import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CardComponent } from '../card/card.component';
import { BadgeComponent } from '../badge/badge.component';
import { ButtonComponent } from '../button/button.component';
import { UtilsService } from '../../services/core/utils.service';
import { WordSuggestionData } from '../../services/poetry';

@Component({
  selector: 'app-word-suggestions',
  standalone: true,
  imports: [CardComponent, BadgeComponent, ButtonComponent],
  templateUrl: './word-suggestions.component.html',
})
export class WordSuggestionsComponent {
  private readonly utils = inject(UtilsService);

  @Input({ required: true }) data!: WordSuggestionData;
  @Output() replaceWord = new EventEmitter<string>();
  @Output() closeSuggestions = new EventEmitter<void>();

  getReasonLabel(reason: string): string {
    const labels: Record<string, string> = {
      'exact-match': 'exact syllables',
      'rhyme-match': 'rhymes with original',
      'sound-match': 'similar sound',
      'semantic-rhyme': 'semantic rhyme',
      'spelling-match': 'spelling match',
      morphological: 'morphological variant',
    };
    return labels[reason] || reason;
  }

  getReasonVariant(reason: string): 'success' | 'info' | 'default' {
    if (reason === 'exact-match') return 'success';
    if (reason === 'rhyme-match' || reason === 'semantic-rhyme') return 'info';
    return 'default';
  }

  getPosLabel(pos: string): string {
    return this.utils.getPosLabel(pos);
  }

  onReplaceWord(word: string): void {
    this.replaceWord.emit(word);
  }
}
