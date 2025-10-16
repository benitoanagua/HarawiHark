import { writeFileSync, mkdirSync } from 'fs';
import { resolve } from 'path';
import { Hct, Blend, argbFromHex, hexFromArgb } from '@material/material-color-utilities';
import { SEED_COLOR, EXTRA_COLORS_CONFIG, TERMINAL_PASTEL_CSS_VARS } from './theme.config';

function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function harmonizeWithSeed(baseColor: number, seedColor: number): number {
  return Blend.harmonize(baseColor, seedColor);
}

function createNeutralColorVariations(isDark: boolean): {
  base: string;
  container: string;
  onContainer: string;
} {
  if (isDark) {
    return {
      base: hexFromArgb(Hct.from(0, 0, 75).toInt()),
      container: hexFromArgb(Hct.from(0, 0, 30).toInt()),
      onContainer: hexFromArgb(Hct.from(0, 0, 90).toInt()),
    };
  } else {
    return {
      base: hexFromArgb(Hct.from(0, 0, 20).toInt()),
      container: hexFromArgb(Hct.from(0, 0, 95).toInt()),
      onContainer: hexFromArgb(Hct.from(0, 0, 15).toInt()),
    };
  }
}

function createTerminalColorVariations(
  baseHct: Hct,
  isDark: boolean
): { base: string; container: string; onContainer: string } {
  const baseTone = isDark ? Math.min(80, baseHct.tone + 30) : baseHct.tone;

  const baseColor = Hct.from(baseHct.hue, baseHct.chroma, baseTone).toInt();

  const containerTone = isDark ? Math.max(25, baseHct.tone - 10) : Math.min(90, baseHct.tone + 15);

  const containerColor = Hct.from(baseHct.hue, baseHct.chroma * 0.7, containerTone).toInt();

  const onContainerTone = isDark ? Math.min(95, baseTone + 60) : Math.max(20, baseTone - 50);

  const onContainerColor = Hct.from(baseHct.hue, baseHct.chroma * 0.2, onContainerTone).toInt();

  return {
    base: hexFromArgb(baseColor),
    container: hexFromArgb(containerColor),
    onContainer: hexFromArgb(onContainerColor),
  };
}

function createPastelColorVariations(
  baseHct: Hct,
  isDark: boolean
): { base: string; container: string; onContainer: string } {
  if (!isDark) {
    const baseColor = Hct.from(baseHct.hue, baseHct.chroma, baseHct.tone).toInt();

    const containerTone = Math.min(92, baseHct.tone + 12);
    const containerChroma = Math.max(10, baseHct.chroma * 0.6);
    const containerColor = Hct.from(baseHct.hue, containerChroma, containerTone).toInt();

    const onContainerTone = Math.max(25, baseHct.tone - 50);
    const onContainerColor = Hct.from(baseHct.hue, baseHct.chroma * 0.15, onContainerTone).toInt();

    return {
      base: hexFromArgb(baseColor),
      container: hexFromArgb(containerColor),
      onContainer: hexFromArgb(onContainerColor),
    };
  } else {
    const baseTone = Math.min(70, baseHct.tone - 15);
    const baseColor = Hct.from(baseHct.hue, baseHct.chroma * 0.9, baseTone).toInt();

    const containerTone = Math.max(40, baseHct.tone - 25);
    const containerColor = Hct.from(baseHct.hue, baseHct.chroma * 0.7, containerTone).toInt();

    const onContainerTone = Math.min(90, baseTone + 45);
    const onContainerColor = Hct.from(baseHct.hue, baseHct.chroma * 0.2, onContainerTone).toInt();

    return {
      base: hexFromArgb(baseColor),
      container: hexFromArgb(containerColor),
      onContainer: hexFromArgb(onContainerColor),
    };
  }
}

function generateTerminalPastelColors(seedColor: string = SEED_COLOR): {
  light: Record<string, string>;
  dark: Record<string, string>;
} {
  const seedArgb = argbFromHex(seedColor);
  const lightColors: Record<string, string> = {};
  const darkColors: Record<string, string> = {};

  Object.entries(EXTRA_COLORS_CONFIG.terminal).forEach(([colorName, config]) => {
    if (colorName === 'black' || colorName === 'white') {
      const lightNeutral = createNeutralColorVariations(false);
      const darkNeutral = createNeutralColorVariations(true);

      lightColors[colorName] = lightNeutral.base;
      lightColors[`${colorName}Container`] = lightNeutral.container;
      lightColors[`on${capitalizeFirst(colorName)}Container`] = lightNeutral.onContainer;

      darkColors[colorName] = darkNeutral.base;
      darkColors[`${colorName}Container`] = darkNeutral.container;
      darkColors[`on${capitalizeFirst(colorName)}Container`] = darkNeutral.onContainer;
      return;
    }

    const baseHct = Hct.from(config.hue, config.chroma, config.tone);
    let baseColor = baseHct.toInt();
    baseColor = harmonizeWithSeed(baseColor, seedArgb);

    const lightVariations = createTerminalColorVariations(Hct.fromInt(baseColor), false);
    const darkVariations = createTerminalColorVariations(Hct.fromInt(baseColor), true);

    lightColors[colorName] = lightVariations.base;
    lightColors[`${colorName}Container`] = lightVariations.container;
    lightColors[`on${capitalizeFirst(colorName)}Container`] = lightVariations.onContainer;

    darkColors[colorName] = darkVariations.base;
    darkColors[`${colorName}Container`] = darkVariations.container;
    darkColors[`on${capitalizeFirst(colorName)}Container`] = darkVariations.onContainer;
  });

  Object.entries(EXTRA_COLORS_CONFIG.pastel).forEach(([colorName, config]) => {
    const baseHct = Hct.from(config.hue, config.chroma, config.tone);
    let baseColor = baseHct.toInt();
    baseColor = harmonizeWithSeed(baseColor, seedArgb);

    const lightVariations = createPastelColorVariations(Hct.fromInt(baseColor), false);
    const darkVariations = createPastelColorVariations(Hct.fromInt(baseColor), true);

    lightColors[colorName] = lightVariations.base;
    lightColors[`${colorName}Container`] = lightVariations.container;
    lightColors[`on${capitalizeFirst(colorName)}Container`] = lightVariations.onContainer;

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
