<script lang="ts">
	import { setLocale, getLocale } from '$lib/paraglide/runtime';
	import { m } from '$lib/paraglide/messages.js';
	import { goto, invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';

	async function switchLanguage(locale: 'en' | 'es') {
		// Cambiar idioma y recargar datos si es necesario
		setLocale(locale);
		await invalidateAll();

		// Opcionalmente navegar a la nueva URL localizada
		const currentPath = $page.url.pathname;
		const newPath =
			locale === 'es'
				? `/es${currentPath}`.replace('/es/es', '/es')
				: currentPath.replace(/^\/es/, '') || '/';

		if (newPath !== currentPath) {
			await goto(newPath, { replaceState: true });
		}
	}
</script>

<div class="flex items-center gap-2">
	<span class="text-sm font-medium text-gray-700 dark:text-gray-300">
		{m.language_switcher()}:
	</span>

	<div class="flex rounded-md overflow-hidden border border-gray-300 dark:border-gray-600">
		<button
			class="px-3 py-1 text-xs font-medium transition-colors"
			class:bg-blue-500={getLocale() === 'es'}
			class:text-white={getLocale() === 'es'}
			class:bg-gray-100={getLocale() !== 'es'}
			class:dark:bg-gray-700={getLocale() !== 'es'}
			onclick={() => switchLanguage('es')}
		>
			🇪🇸 ES
		</button>

		<button
			class="px-3 py-1 text-xs font-medium transition-colors"
			class:bg-blue-500={getLocale() === 'en'}
			class:text-white={getLocale() === 'en'}
			class:bg-gray-100={getLocale() !== 'en'}
			class:dark:bg-gray-700={getLocale() !== 'en'}
			onclick={() => switchLanguage('en')}
		>
			🇺🇸 EN
		</button>
	</div>
</div>
