import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-accordion',
  standalone: true,
  templateUrl: './accordion.component.html',
})
export class AccordionComponent {
  @Input() title = '';
  @Input() expanded = false;
  @Input() icon?: string;

  toggle(): void {
    this.expanded = !this.expanded;
  }
}
