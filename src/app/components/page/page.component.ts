import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import type { User } from '../header/header.component';

@Component({
  selector: 'app-page',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './page.component.html',
  styleUrls: ['./page.css'],
})
export class PageComponent {
  @Input() theme: 'light' | 'dark' = 'light';
  user: User | null = null;

  metroTiles = [
    { label: 'Mail', color: 'var(--color-primary)', icon: '✉️' },
    { label: 'Calendar', color: 'var(--color-error)', icon: '📅' },
    { label: 'Photos', color: 'var(--color-primaryContainer)', icon: '🖼️' },
    { label: 'Store', color: 'var(--color-surfaceVariant)', icon: '🛍️' },
  ];

  documentation = [
    {
      title: 'Design Principles',
      description: 'Learn the core principles of Metro UI design language',
      icon: '🎨',
    },
    {
      title: 'Component Library',
      description: 'Browse our collection of Metro-styled components',
      icon: '🧩',
    },
    {
      title: 'Typography Scale',
      description: 'Understand the typographic hierarchy and spacing',
      icon: '🔤',
    },
    {
      title: 'Motion Guidelines',
      description: 'Implement meaningful animations and transitions',
      icon: '⚡',
    },
  ];

  doLogout() {
    this.user = null;
  }
  doLogin() {
    this.user = { name: 'Jane Doe' };
  }
  doCreateAccount() {
    this.user = { name: 'Jane Doe' };
  }
}
