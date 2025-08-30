import type { Plugin } from 'vite';
import { generateThemeFiles } from './theme-generator';
import type { MaterialThemeOptions } from './types';

export function materialTheme(options: MaterialThemeOptions = {}): Plugin {
	const { outputDir = 'src/lib/tokens' } = options;
	let root: string;

	return {
		name: 'vite-plugin-material-theme',

		configResolved(config) {
			root = config.root;
		},

		async buildStart() {
			generateThemeFiles(root, outputDir);
		},

		configureServer(server) {
			server.watcher.add(`${root}/src/lib/tokens/theme-config.ts`);

			server.watcher.on('change', (file) => {
				if (file.includes('theme-config.ts')) {
					console.log('🔄 Theme configuration changed, regenerating...');
					generateThemeFiles(root, outputDir);
					server.ws.send({ type: 'full-reload' });
				}
			});
		}
	};
}
