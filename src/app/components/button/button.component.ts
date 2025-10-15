import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  templateUrl: './button.component.html',
})
export class ButtonComponent {
  @Input() variant: 'primary' | 'secondary' | 'outline' = 'primary';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() label = 'Button';
  @Input() icon?: string;
  @Output() clicked = new EventEmitter<Event>();

  get buttonClasses(): string {
    const sizeClasses = {
      small: 'btn-small',
      medium: 'btn-medium',
      large: 'btn-large',
    };

    const variantClasses = {
      primary: 'btn-primary',
      secondary: 'btn-secondary',
      outline: 'btn-outline',
    };

    return `btn-base ${sizeClasses[this.size]} ${variantClasses[this.variant]}`;
  }
}
