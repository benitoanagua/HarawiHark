import { writeFileSync, mkdirSync } from 'fs';
import { resolve } from 'path';
import { Hct, Blend, argbFromHex, hexFromArgb } from '@material/material-color-utilities';
import { SEED_COLOR, EXTRA_COLORS_CONFIG, TERMINAL_PASTEL_CSS_VARS } from './theme.config';

function harmonizeWithSeed(baseColor: number, seedColor: number): number {
  return Blend.harmonize(baseColor, seedColor);
}

function createColorVariations(
  baseHct: Hct,
  isDark: boolean
): { base: string; container: string; onContainer: string } {
  const baseTone = isDark ? Math.min(80, baseHct.tone + 40) : baseHct.tone;

  const baseColor = Hct.from(baseHct.hue, baseHct.chroma, baseTone).toInt();

  const containerTone = isDark ? Math.max(20, baseHct.tone - 10) : Math.min(90, baseHct.tone + 15);

  const containerChroma = isDark
    ? Math.min(40, baseHct.chroma * 0.6)
    : Math.min(30, baseHct.chroma * 0.7);

  const containerColor = Hct.from(baseHct.hue, containerChroma, containerTone).toInt();

  const onContainerTone = isDark ? Math.min(95, baseTone + 70) : Math.max(10, baseTone - 70);

  const onContainerChroma = Math.min(10, baseHct.chroma * 0.2);
  const onContainerColor = Hct.from(baseHct.hue, onContainerChroma, onContainerTone).toInt();

  return {
    base: hexFromArgb(baseColor),
    container: hexFromArgb(containerColor),
    onContainer: hexFromArgb(onContainerColor),
  };
}

function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function generateTerminalPastelColors(seedColor: string = SEED_COLOR): {
  light: Record<string, string>;
  dark: Record<string, string>;
} {
  const seedArgb = argbFromHex(seedColor);
  const lightColors: Record<string, string> = {};
  const darkColors: Record<string, string> = {};

  Object.entries(EXTRA_COLORS_CONFIG.terminal).forEach(([colorName, config]) => {
    const baseHct = Hct.from(config.hue, config.chroma, config.tone);
    let baseColor = baseHct.toInt();

    if (colorName !== 'black' && colorName !== 'white') {
      baseColor = harmonizeWithSeed(baseColor, seedArgb);
    }

    const lightVariations = createColorVariations(Hct.fromInt(baseColor), false);
    lightColors[colorName] = lightVariations.base;
    lightColors[`${colorName}Container`] = lightVariations.container;
    lightColors[`on${capitalizeFirst(colorName)}Container`] = lightVariations.onContainer;

    const darkVariations = createColorVariations(Hct.fromInt(baseColor), true);
    darkColors[colorName] = darkVariations.base;
    darkColors[`${colorName}Container`] = darkVariations.container;
    darkColors[`on${capitalizeFirst(colorName)}Container`] = darkVariations.onContainer;
  });

  Object.entries(EXTRA_COLORS_CONFIG.pastel).forEach(([colorName, config]) => {
    const baseHct = Hct.from(config.hue, config.chroma, config.tone);
    let baseColor = baseHct.toInt();

    baseColor = harmonizeWithSeed(baseColor, seedArgb);

    const lightVariations = createColorVariations(Hct.fromInt(baseColor), false);
    lightColors[colorName] = lightVariations.base;
    lightColors[`${colorName}Container`] = lightVariations.container;
    lightColors[`on${capitalizeFirst(colorName)}Container`] = lightVariations.onContainer;

    const darkVariations = createColorVariations(Hct.fromInt(baseColor), true);
    darkColors[colorName] = darkVariations.base;
    darkColors[`${colorName}Container`] = darkVariations.container;
    darkColors[`on${capitalizeFirst(colorName)}Container`] = darkVariations.onContainer;
  });

  return { light: lightColors, dark: darkColors };
}

export function generateTerminalPastelFiles(root: string, outputDir: string): void {
  try {
    console.log('🎨 Generating Terminal & Pastel colors...');
    console.log(`   🎨 Base color: ${SEED_COLOR}`);
    console.log(`   🎨 CSS Variables: ${TERMINAL_PASTEL_CSS_VARS.length}`);

    const { light, dark } = generateTerminalPastelColors();

    const missingLightColors = TERMINAL_PASTEL_CSS_VARS.filter((color) => !light[color]);
    const missingDarkColors = TERMINAL_PASTEL_CSS_VARS.filter((color) => !dark[color]);

    if (missingLightColors.length > 0 || missingDarkColors.length > 0) {
      console.warn('⚠️  Missing colors:', { missingLightColors, missingDarkColors });
    }

    const cssContent = `@theme {
${TERMINAL_PASTEL_CSS_VARS.map((k) => `  --color-${k}: ${light[k] || '#FF00FF'};`).join('\n')}
}

[data-theme="dark"] {
${TERMINAL_PASTEL_CSS_VARS.map((k) => `  --color-${k}: ${dark[k] || '#FF00FF'};`).join('\n')}
}
`;

    const outputPath = resolve(root, outputDir);
    mkdirSync(outputPath, { recursive: true });

    writeFileSync(resolve(outputPath, 'terminal-pastel.css'), cssContent);

    console.log('✅ Terminal & Pastel colors generated successfully:');
    console.log(`   📁 ${outputDir}/terminal-pastel.css`);
    console.log(`   📊 Variables: ${TERMINAL_PASTEL_CSS_VARS.length}`);
    console.log('   🎨 Colors generated using:');
    console.log('     - HCT color space (Material Design 3)');
    console.log('     - Harmonic blending with seed color');
    console.log('     - Automatic light/dark theme variations');
  } catch (error) {
    console.error('❌ Error generating Terminal & Pastel colors:', error);
    throw error;
  }
}

export function generateTerminalPastelCSS(): string {
  try {
    const { light, dark } = generateTerminalPastelColors();

    return `@theme {
${TERMINAL_PASTEL_CSS_VARS.map((k) => `  --color-${k}: ${light[k] || '#FF00FF'};`).join('\n')}
}

[data-theme="dark"] {
${TERMINAL_PASTEL_CSS_VARS.map((k) => `  --color-${k}: ${dark[k] || '#FF00FF'};`).join('\n')}
}`;
  } catch (error) {
    console.error('❌ Error generating Terminal & Pastel CSS:', error);
    return '';
  }
}
