import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CardComponent } from '../card/card.component';
import { BadgeComponent } from '../badge/badge.component';
import { StatusMessageComponent } from '../status-message/status-message.component';
import { EnhancedPoetryResult } from '../../services/poetry';
import { UtilsService } from '../../services/core/utils.service';

@Component({
  selector: 'app-poem-results',
  standalone: true,
  imports: [CardComponent, BadgeComponent, StatusMessageComponent],
  templateUrl: './poem-results.component.html',
})
export class PoemResultsComponent {
  private readonly utils = inject(UtilsService);

  @Input({ required: true }) result!: EnhancedPoetryResult;
  @Output() wordSelected = new EventEmitter<string>();

  onWordClick(word: string): void {
    this.wordSelected.emit(word);
  }

  getPosLabel(pos: string): string {
    return this.utils.getPosLabel(pos);
  }
}
