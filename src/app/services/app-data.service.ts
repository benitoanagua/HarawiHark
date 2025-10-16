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

@Injectable({
  providedIn: 'root',
})
export class AppDataService {
  // Usar colores CSS de Material Design 3
  readonly metroTiles: MetroTile[] = [
    { label: 'mail', color: 'var(--color-primary)', icon: 'icon-[iconoir--mail]' },
    { label: 'calendar', color: 'var(--color-secondary)', icon: 'icon-[iconoir--calendar]' },
    { label: 'photos', color: 'var(--color-tertiary)', icon: 'icon-[iconoir--camera]' },
    { label: 'store', color: 'var(--color-error)', icon: 'icon-[iconoir--shop]' },
  ];

  readonly documentation: DocumentationItem[] = [
    {
      title: 'content, not chrome',
      description: 'Typography-first design. No ornaments, just pure content.',
      icon: 'icon-[iconoir--design-nib]',
    },
    {
      title: 'live tiles',
      description: 'Dynamic flat blocks with real-time updates and bold colors.',
      icon: 'icon-[iconoir--view-grid]',
    },
    {
      title: 'clean typography',
      description: 'Light weight with tight tracking for visual hierarchy.',
      icon: 'icon-[iconoir--text-box]',
    },
    {
      title: 'linear motion',
      description: 'Purposeful animations without decoration or bounce.',
      icon: 'icon-[iconoir--flash]',
    },
  ];
}
