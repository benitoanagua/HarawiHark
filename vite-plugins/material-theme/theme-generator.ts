import {
	DynamicScheme,
	themeFromSourceColor,
	argbFromHex,
	hexFromArgb
} from '@material/material-color-utilities';
import { writeFileSync, mkdirSync } from 'fs';
import { dirname, resolve } from 'path';
import type { ThemeConfig } from '../../src/lib/tokens/theme-config.ts';
import { themeConfig as sharedThemeConfig } from '../../src/lib/tokens/theme-config.js';

export function getThemeConfig(): ThemeConfig {
	// Usar directamente la configuración compartida
	return sharedThemeConfig;
}

// Función para obtener todos los colores dinámicos usando las propiedades del scheme
function getAllDynamicColors(scheme: DynamicScheme): Record<string, string> {
	const colors: Record<string, string> = {};

	// Lista de todas las propiedades de color disponibles en DynamicScheme
	const colorProperties = [
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
		'inverseSurface',
		'inverseOnSurface',
		'outline',
		'outlineVariant',
		'shadow',
		'scrim',
		'surfaceTint',
		'inversePrimary',
		'primaryFixed',
		'primaryFixedDim',
		'onPrimaryFixed',
		'onPrimaryFixedVariant',
		'secondaryFixed',
		'secondaryFixedDim',
		'onSecondaryFixed',
		'onSecondaryFixedVariant',
		'tertiaryFixed',
		'tertiaryFixedDim',
		'onTertiaryFixed',
		'onTertiaryFixedVariant'
	];

	colorProperties.forEach((property) => {
		try {
			const colorValue = (scheme as any)[property];
			if (typeof colorValue === 'number') {
				colors[property] = hexFromArgb(colorValue);
			}
		} catch (error) {
			console.warn(`⚠️ Could not get color property: ${property}`, error);
		}
	});

	return colors;
}

export function generateThemeFiles(root: string, outputDir: string): void {
	try {
		const config = getThemeConfig();
		console.log(
			`🎨 Generating Material Design theme: ${config.seedColor}, variant: ${config.variant}`
		);

		const sourceColorArgb = argbFromHex(config.seedColor);
		const theme = themeFromSourceColor(sourceColorArgb);

		const options = {
			sourceColorArgb,
			variant: config.variant,
			contrastLevel: config.contrastLevel,
			primaryPalette: theme.palettes.primary,
			secondaryPalette: theme.palettes.secondary,
			tertiaryPalette: theme.palettes.tertiary,
			neutralPalette: theme.palettes.neutral,
			neutralVariantPalette: theme.palettes.neutralVariant
		};

		const lightScheme = new DynamicScheme({ ...options, isDark: false });
		const darkScheme = new DynamicScheme({ ...options, isDark: true });

		const lightColors = getAllDynamicColors(lightScheme);
		const darkColors = getAllDynamicColors(darkScheme);

		// Generate CSS content
		const cssContent = `:root {
		${Object.entries(lightColors)
			.map(([key, value]) => `  --color-${key}: ${value};`)
			.join('\n')}
		}

		[data-theme="dark"] {
		${Object.entries(darkColors)
			.map(([key, value]) => `  --color-${key}: ${value};`)
			.join('\n')}
		}`;

		// Generate JSON content
		const jsonContent = JSON.stringify(
			Object.fromEntries(Object.keys(lightColors).map((key) => [key, `var(--color-${key})`])),
			null,
			2
		);

		// Create files
		const createFile = (relativePath: string, content: string) => {
			const fullPath = resolve(root, relativePath);
			mkdirSync(dirname(fullPath), { recursive: true });
			writeFileSync(fullPath, content);
			console.log(`✅ ${relativePath}`);
		};

		createFile(`${outputDir}/themes.css`, cssContent);
		createFile(`${outputDir}/colors.json`, jsonContent);

		console.log('🚀 Themes generated successfully!\n');
	} catch (error) {
		console.error('❌ Error generating themes:', error);
		throw error;
	}
}
