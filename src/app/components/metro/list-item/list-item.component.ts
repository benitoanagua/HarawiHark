// list-item.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-list-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.css'],
})
export class ListItemComponent {
  @Input() title = '';
  @Input() subtitle?: string;
  @Input() icon?: string;
  @Input() badge?: string | number;
  @Input() meta?: string;
  @Input() showChevron = true;
  @Input() disabled = false;
  @Output() itemClick = new EventEmitter<void>();

  onClick(): void {
    if (!this.disabled) {
      this.itemClick.emit();
    }
  }
}
