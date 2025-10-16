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

export const SEED_COLOR = '#F4C2C2';

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

export const SELECTED_SCHEME = 'fidelity';

export const EXTRA_COLORS_CONFIG = {
  terminal: {
    black: { hue: 0, chroma: 0, tone: 10 },
    red: { hue: 10, chroma: 84, tone: 50 },
    green: { hue: 145, chroma: 48, tone: 50 },
    yellow: { hue: 80, chroma: 70, tone: 60 },
    blue: { hue: 245, chroma: 80, tone: 50 },
    magenta: { hue: 330, chroma: 68, tone: 50 },
    cyan: { hue: 190, chroma: 48, tone: 50 },
    white: { hue: 0, chroma: 0, tone: 95 },
  },

  pastel: {
    teal: { hue: 170, chroma: 25, tone: 80 },
    maroon: { hue: 350, chroma: 30, tone: 75 },
    mauve: { hue: 280, chroma: 35, tone: 80 },
    peach: { hue: 20, chroma: 40, tone: 85 },
    lime: { hue: 100, chroma: 45, tone: 85 },
    rosewater: { hue: 10, chroma: 15, tone: 92 },
  },
};

export const THEME_CSS_VARS = [
  'primary',
  'onPrimary',
  'primaryContainer',
  'onPrimaryContainer',
  'secondary',
  'onSecondary',
  'secondaryContainer',
  'onSecondaryContainer',
  'tertiary',
  'onTertiary',
  'tertiaryContainer',
  'onTertiaryContainer',
  'error',
  'onError',
  'errorContainer',
  'onErrorContainer',
  'background',
  'onBackground',
  'surface',
  'surfaceDim',
  'surfaceBright',
  'surfaceContainerLowest',
  'surfaceContainerLow',
  'surfaceContainer',
  'surfaceContainerHigh',
  'surfaceContainerHighest',
  'onSurface',
  'surfaceVariant',
  'onSurfaceVariant',
  'outline',
  'outlineVariant',
  'shadow',
  'scrim',
  'inverseSurface',
  'inverseOnSurface',
  'inversePrimary',
];

export const TERMINAL_PASTEL_CSS_VARS = [
  'black',
  'blackContainer',
  'onBlackContainer',
  'red',
  'redContainer',
  'onRedContainer',
  'green',
  'greenContainer',
  'onGreenContainer',
  'yellow',
  'yellowContainer',
  'onYellowContainer',
  'blue',
  'blueContainer',
  'onBlueContainer',
  'magenta',
  'magentaContainer',
  'onMagentaContainer',
  'cyan',
  'cyanContainer',
  'onCyanContainer',
  'white',
  'whiteContainer',
  'onWhiteContainer',

  'teal',
  'tealContainer',
  'onTealContainer',
  'maroon',
  'maroonContainer',
  'onMaroonContainer',
  'mauve',
  'mauveContainer',
  'onMauveContainer',
  'peach',
  'peachContainer',
  'onPeachContainer',
  'lime',
  'limeContainer',
  'onLimeContainer',
  'rosewater',
  'rosewaterContainer',
  'onRosewaterContainer',
];

export const ALL_CSS_VARS = [...THEME_CSS_VARS, ...TERMINAL_PASTEL_CSS_VARS];

export const THEME_CONFIG = {
  seedColor: SEED_COLOR,
  selectedScheme: SELECTED_SCHEME,
  availableSchemes: SCHEMES.map((s) => s.name),
  materialVariables: THEME_CSS_VARS.length,
  terminalPastelVariables: TERMINAL_PASTEL_CSS_VARS.length,
  totalVariables: ALL_CSS_VARS.length,
};

export interface ThemeColor {
  hue: number;
  chroma: number;
  tone: number;
}

export type TerminalColors = keyof typeof EXTRA_COLORS_CONFIG.terminal;
export type PastelColors = keyof typeof EXTRA_COLORS_CONFIG.pastel;
export type MaterialColors = (typeof THEME_CSS_VARS)[number];
export type AllColors = MaterialColors | TerminalColors | PastelColors;

export function getSchemeConstructor(schemeName: string): SchemeConstructor {
  const scheme = SCHEMES.find((s) => s.name === schemeName);
  if (!scheme) {
    throw new Error(
      `Scheme not found: ${schemeName}. Available schemes: ${SCHEMES.map((s) => s.name).join(', ')}`
    );
  }
  return scheme.variant;
}

export function isValidScheme(schemeName: string): boolean {
  return SCHEMES.some((s) => s.name === schemeName);
}

export function getAvailableSchemes(): string[] {
  return SCHEMES.map((s) => s.name);
}

export function getConfigInfo(): string {
  return `
Theme Configuration:
-------------------
Seed Color: ${SEED_COLOR}
Selected Scheme: ${SELECTED_SCHEME}
Available Schemes: ${getAvailableSchemes().join(', ')}
Material Variables: ${THEME_CSS_VARS.length}
Terminal & Pastel Variables: ${TERMINAL_PASTEL_CSS_VARS.length}
Total Variables: ${ALL_CSS_VARS.length}
  `.trim();
}
