// progress.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-progress',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './progress.component.html',
})
export class ProgressComponent {
  @Input() type: 'bar' | 'ring' = 'bar';
  @Input() value?: number;
  @Input() label?: string;
}
