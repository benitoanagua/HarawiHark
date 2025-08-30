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
	<div class="flex rounded-md overflow-hidden border border-outlineVariant">
		<button
			class="px-3 py-1 text-xs font-medium transition-colors"
			class:bg-primary={getLocale() === 'es'}
			class:text-onPrimary={getLocale() === 'es'}
			class:bg-surfaceContainer={getLocale() !== 'es'}
			class:text-onSurfaceVariant={getLocale() !== 'es'}
			onclick={() => switchLanguage('es')}
			title="Español"
		>
			🇪🇸 ES
		</button>

		<button
			class="px-3 py-1 text-xs font-medium transition-colors"
			class:bg-primary={getLocale() === 'en'}
			class:text-onPrimary={getLocale() === 'en'}
			class:bg-surfaceContainer={getLocale() !== 'en'}
			class:text-onSurfaceVariant={getLocale() !== 'en'}
			onclick={() => switchLanguage('en')}
			title="English"
		>
			🇺🇸 EN
		</button>
	</div>
</div>
