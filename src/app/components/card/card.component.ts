import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card',
  standalone: true,
  templateUrl: './card.component.html',
})
export class CardComponent {
  @Input() variant: 'default' | 'elevated' = 'default';
  @Input() padding: 'none' | 'small' | 'medium' | 'large' = 'medium';
  @Input() clickable = false;

  get cardClasses(): string {
    const classes = [`card-${this.variant}`, `card-padding-${this.padding}`];

    if (this.clickable) {
      classes.push('clickable');
    }

    return classes.join(' ');
  }
}
