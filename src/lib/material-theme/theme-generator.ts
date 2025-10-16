import { writeFileSync, mkdirSync } from 'fs';
import { resolve } from 'path';
import {
  argbFromHex,
  hexFromArgb,
  MaterialDynamicColors,
  Hct,
  DynamicScheme,
} from '@material/material-color-utilities';
import { SEED_COLOR, SCHEMES, SELECTED_SCHEME, THEME_CSS_VARS } from './theme.config';

function getColorFromScheme(prop: string, scheme: DynamicScheme): number {
  const materialColors = MaterialDynamicColors as unknown as Record<
    string,
    { getArgb: (scheme: DynamicScheme) => number } | undefined
  >;

  const colorGetter = materialColors[prop];
  if (!colorGetter || typeof colorGetter.getArgb !== 'function') {
    throw new Error(`Color property not found or invalid: ${prop}`);
  }
  return colorGetter.getArgb(scheme);
}

function extractColors(scheme: DynamicScheme): Record<string, string> {
  const colors: Record<string, string> = {};
  for (const prop of THEME_CSS_VARS) {
    try {
      const color = getColorFromScheme(prop, scheme);
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
    console.log(`   🎨 CSS Variables: ${THEME_CSS_VARS.length}`);

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

    console.log('✅ Material theme generated successfully:');
    console.log(`   📁 ${outputDir}/material-theme.css`);
    console.log(`   📊 Variables: ${THEME_CSS_VARS.length}`);
  } catch (error) {
    console.error('❌ Error generating Material theme:', error);
    throw error;
  }
}
