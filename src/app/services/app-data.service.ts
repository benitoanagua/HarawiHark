import { Injectable } from '@angular/core';

export interface MetroTile {
  label: string;
  color: string;
  icon: string;
}

export interface DocumentationItem {
  title: string;
  description: string;
  icon: string;
}

export interface NavigationItem {
  title: string;
  icon: string;
  description: string;
}

@Injectable({
  providedIn: 'root',
})
export class AppDataService {
  readonly metroTiles: MetroTile[] = [
    { label: 'Mail', color: 'var(--color-primary)', icon: 'icon-[iconoir--mail]' },
    { label: 'Calendar', color: 'var(--color-error)', icon: 'icon-[iconoir--calendar]' },
    { label: 'Photos', color: 'var(--color-primaryContainer)', icon: 'icon-[iconoir--camera]' },
    { label: 'Store', color: 'var(--color-surfaceVariant)', icon: 'icon-[iconoir--shop]' },
  ];

  readonly documentation: DocumentationItem[] = [
    {
      title: 'Design Principles',
      description: 'Learn the core principles of Metro UI design language',
      icon: 'icon-[iconoir--design-nib]',
    },
    {
      title: 'Component Library',
      description: 'Browse our collection of Metro-styled components',
      icon: 'icon-[iconoir--view-grid]',
    },
    {
      title: 'Typography Scale',
      description: 'Understand the typographic hierarchy and spacing',
      icon: 'icon-[iconoir--text-box]',
    },
    {
      title: 'Motion Guidelines',
      description: 'Implement meaningful animations and transitions',
      icon: 'icon-[iconoir--flash]',
    },
  ];

  readonly navigationItems: NavigationItem[] = [
    {
      title: 'Explore Documentation',
      icon: 'icon-[iconoir--book-stack]',
      description: 'Learn about Angular features',
    },
    {
      title: 'Tutorials',
      icon: 'icon-[iconoir--graduation-cap]',
      description: 'Step-by-step learning guides',
    },
    {
      title: 'AI Development',
      icon: 'icon-[iconoir--chat-bubble]',
      description: 'Build with AI assistance',
    },
    {
      title: 'CLI Tools',
      icon: 'icon-[iconoir--terminal]',
      description: 'Command line interface docs',
    },
  ];
}
