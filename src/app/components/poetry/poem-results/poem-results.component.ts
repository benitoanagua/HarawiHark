import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CardComponent, BadgeComponent } from '../../ui';
import { EnhancedPoetryResult, UtilsService } from '../../../services';

@Component({
  selector: 'app-poem-results',
  standalone: true,
  imports: [CardComponent, BadgeComponent],
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
