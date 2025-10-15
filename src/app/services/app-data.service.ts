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
  // Colores Metro oficiales
  readonly metroTiles: MetroTile[] = [
    { label: 'Mail', color: '#0078D7', icon: 'icon-[iconoir--mail]' },
    { label: 'Calendar', color: '#F7630C', icon: 'icon-[iconoir--calendar]' },
    { label: 'Photos', color: '#00ABA9', icon: 'icon-[iconoir--camera]' },
    { label: 'Store', color: '#8CBF26', icon: 'icon-[iconoir--shop]' },
  ];

  readonly documentation: DocumentationItem[] = [
    {
      title: 'Design Principles',
      description: 'Content, not chrome. Typography-first design language.',
      icon: 'icon-[iconoir--design-nib]',
    },
    {
      title: 'Live Tiles',
      description: 'Dynamic, flat, colorful blocks with real-time updates.',
      icon: 'icon-[iconoir--view-grid]',
    },
    {
      title: 'Typography Scale',
      description: 'Segoe UI Light with tight tracking for hierarchy.',
      icon: 'icon-[iconoir--text-box]',
    },
    {
      title: 'Motion Language',
      description: '2D linear animations with purpose, not decoration.',
      icon: 'icon-[iconoir--flash]',
    },
  ];
}
