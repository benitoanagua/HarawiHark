import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-error-display',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './error-display.component.html',
})
export class ErrorDisplayComponent {
  @Input() title = 'error';
  @Input() message = '';
  @Input() severity: 'info' | 'warning' | 'error' = 'error';
  @Input() actionLabel?: string;
  @Output() action = new EventEmitter<void>();

  get iconClass(): string {
    const icons = {
      info: 'icon-[iconoir--info-circle]',
      warning: 'icon-[iconoir--warning-triangle]',
      error: 'icon-[iconoir--cancel]',
    };
    return icons[this.severity];
  }

  get containerClasses(): string {
    return `error-display error-${this.severity}`;
  }
}
