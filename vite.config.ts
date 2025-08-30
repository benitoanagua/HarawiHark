import { sveltekit } from '@sveltejs/kit/vite';
import UnoCSS from 'unocss/vite';
import { defineConfig } from 'vite';
import { paraglideVitePlugin } from '@inlang/paraglide-js';
import { materialTheme } from './vite-plugins';

export default defineConfig({
	plugins: [
		materialTheme({ outputDir: 'src/lib/tokens' }),
		UnoCSS(),
		sveltekit(),
		paraglideVitePlugin({
			project: './project.inlang',
			outdir: './src/lib/paraglide'
		})
	],
	// Optimizar dependencias
	optimizeDeps: {
		include: ['@material/material-color-utilities']
	},
	// Asegurar que los cambios en los tokens recarguen
	server: {
		watch: {
			ignored: ['!**/src/lib/tokens/**']
		}
	}
});
