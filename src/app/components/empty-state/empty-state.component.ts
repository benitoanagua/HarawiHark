import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './empty-state.component.html',
})
export class EmptyStateComponent {
  @Input() icon = 'icon-[iconoir--page-search]';
  @Input() title = '';
  @Input() description = '';
  @Input() actionLabel?: string;
  @Output() action = new EventEmitter<void>();
}
