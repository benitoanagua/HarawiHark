import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../card/card.component';
import { BadgeComponent } from '../badge/badge.component';
import { EnhancedPoetryResult } from '../../services/poetry';

@Component({
  selector: 'app-meter-analysis-section',
  standalone: true,
  imports: [CommonModule, CardComponent, BadgeComponent],
  templateUrl: './meter-analysis-section.component.html',
})
export class MeterAnalysisSectionComponent {
  @Input({ required: true }) result!: EnhancedPoetryResult;
}
