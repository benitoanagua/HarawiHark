import { Component, Input } from '@angular/core';

export interface AnalysisMetric {
  label: string;
  value: number | string;
  maxValue?: number;
  variant?: 'default' | 'success' | 'warning' | 'error';
  icon?: string;
}

@Component({
  selector: 'app-analysis-panel',
  standalone: true,
  templateUrl: './analysis-panel.component.html',
})
export class AnalysisPanelComponent {
  @Input() title = '';
  @Input() metrics: AnalysisMetric[] = [];
  @Input() compact = false;

  getMetricVariant(metric: AnalysisMetric): string {
    return `metric-${metric.variant || 'default'}`;
  }

  getProgressWidth(metric: AnalysisMetric): string {
    if (metric.maxValue && typeof metric.value === 'number') {
      const percentage = (metric.value / metric.maxValue) * 100;
      return `${Math.min(percentage, 100)}%`;
    }
    return '0%';
  }
}
