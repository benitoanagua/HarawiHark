import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';

export interface User {
  name: string;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ButtonComponent, ThemeToggleComponent],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  @Input() user: User | null = null;
  @Output() login = new EventEmitter<Event>();
  @Output() logout = new EventEmitter<Event>();
  @Output() createAccount = new EventEmitter<Event>();
}
