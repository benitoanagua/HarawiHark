// src/app/components/poem-quality/poem-quality.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QualityMetrics } from '../../services/poem-quality.service';
import { CardComponent } from '../card/card.component';
import { BadgeComponent } from '../badge/badge.component';

@Component({
  selector: 'app-poem-quality',
  standalone: true,
  imports: [CommonModule, CardComponent, BadgeComponent],
  templateUrl: './poem-quality.component.html',
})
export class PoemQualityComponent {
  @Input({ required: true }) metrics!: QualityMetrics;

  getMetricEntries(): { name: string; value: number }[] {
    return Object.entries(this.metrics.breakdown).map(([key, value]) => ({
      name: key.replace(/([A-Z])/g, ' $1').toLowerCase(),
      value,
    }));
  }

  getMetricColor(value: number): string {
    if (value >= 80) return 'metric-excellent';
    if (value >= 70) return 'metric-good';
    if (value >= 60) return 'metric-fair';
    return 'metric-poor';
  }

  getGradeVariant(grade: string): 'success' | 'info' | 'warning' | 'error' {
    switch (grade) {
      case 'A+':
      case 'A':
        return 'success';
      case 'B+':
      case 'B':
        return 'info';
      case 'C+':
      case 'C':
        return 'warning';
      default:
        return 'error';
    }
  }
}
