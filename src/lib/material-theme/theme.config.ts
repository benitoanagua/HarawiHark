import {
  SchemeTonalSpot,
  SchemeNeutral,
  SchemeVibrant,
  SchemeExpressive,
  SchemeMonochrome,
  SchemeContent,
  SchemeFidelity,
  SchemeFruitSalad,
  SchemeRainbow,
  Hct,
  type DynamicScheme,
} from '@material/material-color-utilities';

export type SchemeConstructor = new (
  sourceColorHct: Hct,
  isDark: boolean,
  contrastLevel: number
) => DynamicScheme;

export const SEED_COLOR = '#409D44';

export const SCHEMES: { name: string; variant: SchemeConstructor }[] = [
  { name: 'tonal-spot', variant: SchemeTonalSpot },
  { name: 'neutral', variant: SchemeNeutral },
  { name: 'vibrant', variant: SchemeVibrant },
  { name: 'expressive', variant: SchemeExpressive },
  { name: 'monochrome', variant: SchemeMonochrome },
  { name: 'content', variant: SchemeContent },
  { name: 'fidelity', variant: SchemeFidelity },
  { name: 'fruit-salad', variant: SchemeFruitSalad },
  { name: 'rainbow', variant: SchemeRainbow },
];

export const SELECTED_SCHEME = 'content';
