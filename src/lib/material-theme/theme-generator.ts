import { writeFileSync, mkdirSync } from 'fs';
import { resolve } from 'path';
import {
  argbFromHex,
  hexFromArgb,
  MaterialDynamicColors,
  Hct,
} from '@material/material-color-utilities';
import { SEED_COLOR, SCHEMES, SELECTED_SCHEME } from './theme.config';

const THEME_CSS_VARS = [
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

function extractColors(scheme: any) {
  const colors: Record<string, string> = {};
  for (const prop of THEME_CSS_VARS) {
    try {
      const color = (MaterialDynamicColors as any)[prop]?.getArgb(scheme);
      colors[prop] = hexFromArgb(color);
    } catch {
      colors[prop] = '#FF00FF';
      console.warn(`Could not extract: ${prop}`);
    }
  }
  return colors;
}

export function generateThemeFiles(root: string, outputDir: string): void {
  try {
    console.log('🎨 Harawihark - Generating Material Design theme...');
    console.log(`   🎨 Base color: ${SEED_COLOR}`);
    console.log(`   🎨 Scheme: ${SELECTED_SCHEME}`);

    const selectedScheme = SCHEMES.find((s) => s.name === SELECTED_SCHEME);
    if (!selectedScheme) {
      throw new Error(`Scheme not found: ${SELECTED_SCHEME}`);
    }

    const { variant: SchemeConstructor } = selectedScheme;

    const lightScheme = new SchemeConstructor(Hct.fromInt(argbFromHex(SEED_COLOR)), false, 0);
    const darkScheme = new SchemeConstructor(Hct.fromInt(argbFromHex(SEED_COLOR)), true, 0);

    const lightColors = extractColors(lightScheme);
    const darkColors = extractColors(darkScheme);

    const cssContent = `@theme {
${THEME_CSS_VARS.map((k) => `  --color-${k}: ${lightColors[k]};`).join('\n')}
}

[data-theme="dark"] {
${THEME_CSS_VARS.map((k) => `  --color-${k}: ${darkColors[k]};`).join('\n')}
}
`;

    const outputPath = resolve(root, outputDir);
    mkdirSync(outputPath, { recursive: true });

    writeFileSync(resolve(outputPath, 'material-theme.css'), cssContent);

    console.log('✅ Theme generated successfully:');
    console.log(`   📁 ${outputDir}/material-theme.css`);
  } catch (error) {
    console.error('❌ Error generating theme:', error);
    throw error;
  }
}
