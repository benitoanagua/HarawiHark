import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrls: ['./button.css'],
})
export class ButtonComponent {
  @Input()
  variant: 'primary' | 'secondary' | 'outline' = 'primary';

  @Input()
  size: 'small' | 'medium' | 'large' = 'medium';

  @Input()
  theme: 'light' | 'dark' = 'light';

  @Input()
  label = 'Button';

  @Output()
  clicked = new EventEmitter<Event>();

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
