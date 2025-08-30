import {
	defineConfig,
	presetWind4,
	presetAttributify,
	presetTypography,
	presetIcons
} from 'unocss';
import extractorSvelte from '@unocss/extractor-svelte';

export default defineConfig({
	extractors: [extractorSvelte()],
	presets: [presetWind4(), presetAttributify(), presetTypography(), presetIcons({ scale: 1.2 })],
	shortcuts: {
		btn: 'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition hover:opacity-90',
		'btn-primary': 'btn bg-blue-600 text-white',
		'btn-secondary': 'btn bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-gray-100'
	}
});
