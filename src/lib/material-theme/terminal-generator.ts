import { writeFileSync, mkdirSync } from 'fs';
import { resolve } from 'path';
import { Hct, Blend, argbFromHex, hexFromArgb } from '@material/material-color-utilities';
import { SEED_COLOR, TERMINAL_COLORS_CONFIG, TERMINAL_CSS_VARS } from './theme.config';

function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function harmonizeWithSeed(baseColor: number, seedColor: number): number {
  return Blend.harmonize(baseColor, seedColor);
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

function generateTerminalColors(seedColor: string = SEED_COLOR): {
  light: Record<string, string>;
  dark: Record<string, string>;
} {
  const seedArgb = argbFromHex(seedColor);
  const lightColors: Record<string, string> = {};
  const darkColors: Record<string, string> = {};

  Object.entries(TERMINAL_COLORS_CONFIG).forEach(([colorName, config]) => {
    const baseHct = Hct.from(config.hue, config.chroma, config.tone);
    let baseColor = baseHct.toInt();
    baseColor = harmonizeWithSeed(baseColor, seedArgb);

    const lightVariations = createTerminalColorVariations(Hct.fromInt(baseColor), false);
    const darkVariations = createTerminalColorVariations(Hct.fromInt(baseColor), true);

    lightColors[colorName] = lightVariations.base;
    lightColors[`${colorName}Container`] = lightVariations.container;
    lightColors[`on${capitalizeFirst(colorName)}Container`] = lightVariations.onContainer;

    darkColors[`inverse${capitalizeFirst(colorName)}`] = darkVariations.base;
    darkColors[`inverse${capitalizeFirst(colorName)}Container`] = darkVariations.container;
    darkColors[`inverseOn${capitalizeFirst(colorName)}Container`] = darkVariations.onContainer;
  });

  return { light: lightColors, dark: darkColors };
}

export function generateTerminalFiles(root: string, outputDir: string): void {
  try {
    console.log('🎨 Generating Terminal colors...');
    console.log(`   🎨 Base color: ${SEED_COLOR}`);
    console.log(`   🎨 CSS Variables: ${TERMINAL_CSS_VARS.length}`);

    const { light, dark } = generateTerminalColors();

    const cssContent = `@theme {
${TERMINAL_CSS_VARS.map((k) => {
  const value = light[k] || dark[k] || '#FF00FF';
  return `  --color-${k}: ${value};`;
}).join('\n')}
}

[data-theme="dark"] {
${TERMINAL_CSS_VARS.map((k) => {
  if (k.startsWith('inverse')) {
    const baseName = k.replace('inverse', '').replace(/^[a-z]/, (char) => char.toLowerCase());
    return `  --color-${baseName}: ${dark[k] || '#FF00FF'};`;
  } else {
    const inverseName = 'inverse' + k.replace(/^[a-z]/, (char) => char.toUpperCase());
    return `  --color-${k}: ${dark[inverseName] || '#FF00FF'};`;
  }
}).join('\n')}
}
`;

    const outputPath = resolve(root, outputDir);
    mkdirSync(outputPath, { recursive: true });

    writeFileSync(resolve(outputPath, 'terminal-theme.css'), cssContent);

    console.log('✅ Terminal colors generated successfully:');
    console.log(`   📁 ${outputDir}/terminal-theme.css`);
    console.log(`   📊 Variables: ${TERMINAL_CSS_VARS.length}`);
    console.log('   🎨 Colors generated using:');
    console.log('     - HCT color space (Material Design 3)');
    console.log('     - Harmonic blending with seed color');
    console.log('     - Automatic light/dark theme variations with inverse colors');
  } catch (error) {
    console.error('❌ Error generating Terminal colors:', error);
    throw error;
  }
}

export function generateTerminalCSS(): string {
  try {
    const { light, dark } = generateTerminalColors();
    return `@theme {
${TERMINAL_CSS_VARS.map((k) => {
  const value = light[k] || dark[k] || '#FF00FF';
  return `  --color-${k}: ${value};`;
}).join('\n')}
}

[data-theme="dark"] {
${TERMINAL_CSS_VARS.map((k) => {
  if (k.startsWith('inverse')) {
    const baseName = k.replace('inverse', '').replace(/^[a-z]/, (char) => char.toLowerCase());
    return `  --color-${baseName}: ${dark[k] || '#FF00FF'};`;
  } else {
    const inverseName = 'inverse' + k.replace(/^[a-z]/, (char) => char.toUpperCase());
    return `  --color-${k}: ${dark[inverseName] || '#FF00FF'};`;
  }
}).join('\n')}
}`;
  } catch (error) {
    console.error('❌ Error generating Terminal CSS:', error);
    return '';
  }
}
