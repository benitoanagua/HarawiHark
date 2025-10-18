import { Component, Input } from '@angular/core';
import { CardComponent } from '../card/card.component';

export interface QuickStats {
  totalSyllables: number;
  avgSyllablesPerLine: number;
  vocabularyRichness: number;
  patternMatch: string;
}

@Component({
  selector: 'app-quick-stats-panel',
  standalone: true,
  imports: [CardComponent],
  templateUrl: './quick-stats-panel.component.html',
})
export class QuickStatsPanelComponent {
  @Input({ required: true }) stats!: QuickStats;
}
