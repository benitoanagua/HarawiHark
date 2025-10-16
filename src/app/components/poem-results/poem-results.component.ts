import { Component, Input } from '@angular/core';
import { CardComponent } from '../card/card.component';
import { BadgeComponent } from '../badge/badge.component';
import { StatusMessageComponent } from '../status-message/status-message.component';
import { PoetryResult } from '../../models/poetry.model';

@Component({
  selector: 'app-poem-results',
  standalone: true,
  imports: [CardComponent, BadgeComponent, StatusMessageComponent],
  templateUrl: './poem-results.component.html',
})
export class PoemResultsComponent {
  @Input({ required: true }) result!: PoetryResult;
}
