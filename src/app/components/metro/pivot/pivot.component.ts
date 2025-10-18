// pivot.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface PivotItem {
  id: string;
  label: string;
  disabled?: boolean;
}

@Component({
  selector: 'app-pivot',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pivot.component.html',
  styleUrls: ['./pivot.component.css'],
})
export class PivotComponent {
  @Input() items: PivotItem[] = [];
  @Input() selectedId = '';
  @Output() selectedChange = new EventEmitter<string>();

  select(id: string): void {
    if (this.selectedId !== id) {
      this.selectedId = id;
      this.selectedChange.emit(id);
    }
  }
}
