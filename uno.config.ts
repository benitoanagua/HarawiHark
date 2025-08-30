import {
	defineConfig,
	presetWind4,
	presetAttributify,
	presetTypography,
	presetIcons
} from 'unocss';
import extractorSvelte from '@unocss/extractor-svelte';
import colors from './src/lib/tokens/colors.json';

export default defineConfig({
	extractors: [extractorSvelte()],
	presets: [presetWind4(), presetAttributify(), presetTypography(), presetIcons()],
	theme: {
		colors
	},
	shortcuts: {
		// Base button
		btn: 'inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 active:scale-95 disabled:opacity-60 disabled:pointer-events-none',

		// Material Design 3 buttons
		'btn-primary': 'btn bg-primary text-onPrimary hover:shadow-md focus:ring-primary/20',
		'btn-secondary': 'btn bg-secondary text-onSecondary hover:shadow-md focus:ring-secondary/20',
		'btn-outline':
			'btn border border-outline text-primary bg-transparent hover:bg-primary hover:text-onPrimary focus:ring-primary/20',
		'btn-text':
			'btn text-primary bg-transparent hover:bg-primary/8 focus:ring-primary/20 px-4 py-2',

		// Card variants
		card: 'bg-surface border border-outlineVariant rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200',
		'card-filled': 'bg-surfaceContainerHighest rounded-xl',
		'card-elevated':
			'bg-surface rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200',

		// Input fields
		'input-outlined':
			'bg-transparent border border-outline rounded px-4 py-3 text-onSurface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-onSurfaceVariant transition-all duration-200',
		'input-filled':
			'bg-surfaceContainerHighest border-0 border-b-2 border-outline rounded-t px-4 py-3 text-onSurface focus:outline-none focus:border-primary placeholder:text-onSurfaceVariant transition-all duration-200'
	}
});
