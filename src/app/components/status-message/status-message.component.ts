import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-status-message',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './status-message.component.html',
})
export class StatusMessageComponent {
  @Input() title = '';
  @Input() message = '';
  @Input() severity: 'info' | 'warning' | 'error' | 'success' = 'info';
  @Input() actionLabel?: string;
  @Output() action = new EventEmitter<void>();

  get iconClass(): string {
    const icons = {
      info: 'icon-[iconoir--info-circle]',
      warning: 'icon-[iconoir--warning-triangle]',
      error: 'icon-[iconoir--cancel]',
      success: 'icon-[iconoir--check]',
    };
    return icons[this.severity];
  }

  get containerClasses(): string {
    return `status-message status-${this.severity}`;
  }
}
