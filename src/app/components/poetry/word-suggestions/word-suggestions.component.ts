import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CardComponent, BadgeComponent, ButtonComponent } from '../../ui';
import { UtilsService, WordSuggestionData } from '../../../services';

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
