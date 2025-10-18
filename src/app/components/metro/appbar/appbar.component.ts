// appbar.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface AppBarAction {
  id: string;
  icon: string;
  label: string;
  disabled?: boolean;
}

@Component({
  selector: 'app-appbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './appbar.component.html',
})
export class AppBarComponent {
  @Input() actions: AppBarAction[] = [];
  @Input() hidden = false;
  @Output() actionClick = new EventEmitter<string>();

  onActionClick(actionId: string, disabled?: boolean): void {
    if (!disabled) {
      this.actionClick.emit(actionId);
    }
  }
}
