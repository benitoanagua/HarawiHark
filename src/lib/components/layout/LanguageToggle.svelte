<script lang="ts">
	import { setLocale, getLocale } from '$lib/paraglide/runtime';
	import { m } from '$lib/paraglide/messages.js';
	import { goto, invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';

	async function switchLanguage(locale: 'en' | 'es') {
		setLocale(locale);
		await invalidateAll();

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
	<div class="flex rounded-md overflow-hidden border border-gray-300 dark:border-gray-600">
		<button
			class="px-3 py-1 text-xs font-medium transition-colors"
			class:bg-blue-500={getLocale() === 'es'}
			class:text-white={getLocale() === 'es'}
			class:bg-gray-100={getLocale() !== 'es'}
			class:dark:bg-gray-700={getLocale() !== 'es'}
			onclick={() => switchLanguage('es')}
			title="Español"
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
			title="English"
		>
			🇺🇸 EN
		</button>
	</div>
</div>
