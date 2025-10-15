import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';

export interface User {
  name: string;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.css'],
})
export class HeaderComponent {
  @Input() user: User | null = null;
  @Input() theme: 'light' | 'dark' = 'light';
  @Output() login = new EventEmitter<Event>();
  @Output() logout = new EventEmitter<Event>();
  @Output() createAccount = new EventEmitter<Event>();
}
