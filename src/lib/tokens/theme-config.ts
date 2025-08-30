/**
 * Material Design theme configuration
 * Change values here to automatically regenerate all themes
 *
 * Variants (use the numeric value):
 * 0: MONOCHROME
 * 1: NEUTRAL
 * 2: TONAL_SPOT (default)
 * 3: VIBRANT
 * 4: EXPRESSIVE
 * 5: FIDELITY
 * 6: CONTENT
 * 7: RAINBOW
 * 8: FRUIT_SALAD
 */

export interface ThemeConfig {
	seedColor: string;
	contrastLevel: number;
	variant: number;
}

export const themeConfig: ThemeConfig = {
	// Primary seed color - change this to generate new themes
	seedColor: '#fff1dd',

	// Contrast level (-1 = minimum, 0 = standard, 1 = maximum)
	contrastLevel: -1,

	// Variant of Material Design 3 scheme (use numeric values)
	variant: 2 // TONAL_SPOT
};

export const seedColor = themeConfig.seedColor;
export const contrastLevel = themeConfig.contrastLevel;
export const variant = themeConfig.variant;

// Tipos para mejor autocompletado
export type ThemeVariant =
	| 'MONOCHROME'
	| 'NEUTRAL'
	| 'TONAL_SPOT'
	| 'VIBRANT'
	| 'EXPRESSIVE'
	| 'FIDELITY'
	| 'CONTENT'
	| 'RAINBOW'
	| 'FRUIT_SALAD';

// Helper para obtener el nombre de la variante
export function getVariantName(variantNumber: number): string {
	const variantNames: Record<number, string> = {
		0: 'MONOCHROME',
		1: 'NEUTRAL',
		2: 'TONAL_SPOT',
		3: 'VIBRANT',
		4: 'EXPRESSIVE',
		5: 'FIDELITY',
		6: 'CONTENT',
		7: 'RAINBOW',
		8: 'FRUIT_SALAD'
	};
	return variantNames[variantNumber] || 'TONAL_SPOT';
}
