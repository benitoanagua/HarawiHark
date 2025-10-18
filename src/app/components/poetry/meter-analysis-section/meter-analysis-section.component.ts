import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent, BadgeComponent } from '../../ui';
import { EnhancedPoetryResult } from '../../../services/';

@Component({
  selector: 'app-meter-analysis-section',
  standalone: true,
  imports: [CommonModule, CardComponent, BadgeComponent],
  templateUrl: './meter-analysis-section.component.html',
})
export class MeterAnalysisSectionComponent {
  @Input({ required: true }) result!: EnhancedPoetryResult;
}
