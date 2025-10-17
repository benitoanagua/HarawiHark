import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CardComponent } from '../card/card.component';
import { BadgeComponent } from '../badge/badge.component';
import { StatusMessageComponent } from '../status-message/status-message.component';
import { EnhancedPoetryResult } from '../../services/poetry-analyzer.service';

@Component({
  selector: 'app-poem-results',
  standalone: true,
  imports: [CardComponent, BadgeComponent, StatusMessageComponent],
  templateUrl: './poem-results.component.html',
})
export class PoemResultsComponent {
  @Input({ required: true }) result!: EnhancedPoetryResult;
  @Output() wordSelected = new EventEmitter<string>();

  onWordClick(word: string): void {
    this.wordSelected.emit(word);
  }

  getPosLabel(pos: string): string {
    const labels: Record<string, string> = {
      nn: 'noun',
      nns: 'noun (plural)',
      nnp: 'proper noun',
      vb: 'verb',
      vbd: 'verb (past)',
      vbg: 'verb (gerund)',
      vbn: 'verb (past participle)',
      vbp: 'verb (present)',
      vbz: 'verb (3rd person)',
      jj: 'adjective',
      jjr: 'adjective (comparative)',
      jjs: 'adjective (superlative)',
      rb: 'adverb',
      rbr: 'adverb (comparative)',
      rbs: 'adverb (superlative)',
      dt: 'determiner',
      in: 'preposition',
      cc: 'conjunction',
      prp: 'pronoun',
      prp$: 'possessive pronoun',
      uh: 'interjection',
    };
    return labels[pos.toLowerCase()] || pos;
  }
}
