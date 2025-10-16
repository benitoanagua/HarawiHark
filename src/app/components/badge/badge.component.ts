import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-badge',
  standalone: true,
  templateUrl: './badge.component.html',
})
export class BadgeComponent {
  @Input() variant: 'default' | 'success' | 'warning' | 'error' = 'default';
  @Input() size: 'small' | 'medium' = 'medium';
  @Input() icon?: string;

  get badgeClasses(): string {
    return `badge-${this.variant} badge-${this.size}`;
  }
}
