import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import UnoCSS from 'unocss/vite';

export default defineConfig({
	plugins: [UnoCSS(), sveltekit()],

	// Optimizaciones para i18n
	define: {
		__SUPPORTED_LOCALES__: JSON.stringify(['en', 'es'])
	},

	// Preload de módulos críticos
	build: {
		rollupOptions: {
			output: {
				manualChunks: {
					paraglide: ['$lib/paraglide/messages.js', '$lib/paraglide/runtime'],
					syllable: ['simi-syllable']
				}
			}
		}
	},

	// Optimizaciones para desarrollo
	server: {
		fs: {
			allow: ['..']
		}
	}
});
