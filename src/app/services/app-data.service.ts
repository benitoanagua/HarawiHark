// src/app/services/app-data.service.ts
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
  readonly metroTiles: MetroTile[] = [
    { label: 'haiku', color: 'var(--color-primary)', icon: 'icon-[iconoir--flower]' },
    { label: 'tanka', color: 'var(--color-secondary)', icon: 'icon-[iconoir--page]' },
    { label: 'limerick', color: 'var(--color-tertiary)', icon: 'icon-[iconoir--chat-lines]' },
    { label: 'sonnet', color: 'var(--color-error)', icon: 'icon-[iconoir--book]' },
  ];

  readonly documentation: DocumentationItem[] = [
    {
      title: 'syllable counting',
      description: 'uses rita.js for accurate phonetic analysis of english text',
      icon: 'icon-[iconoir--design-nib]',
    },
    {
      title: '8 poetic forms',
      description:
        'supports haiku, tanka, cinquain, limerick, redondilla, lanterne, diamante, fibonacci',
      icon: 'icon-[iconoir--view-grid]',
    },
    {
      title: 'real-time feedback',
      description: 'instant syllable breakdown and pattern matching as you type',
      icon: 'icon-[iconoir--flash]',
    },
    {
      title: 'rhyme analysis',
      description: 'automatically detects rhyme schemes and stress patterns',
      icon: 'icon-[iconoir--sound-high]',
    },
  ];
}
