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

<div class="flex items-center">
	<div class="bg-surfaceContainer rounded-full border border-outlineVariant overflow-hidden">
		<div class="flex">
			<button
				class="px-4 py-2 text-xs font-medium transition-all duration-200 ease-out
					   flex items-center gap-2 min-w-[60px] justify-center"
				class:bg-secondaryContainer={getLocale() === 'es'}
				class:text-onSecondaryContainer={getLocale() === 'es'}
				class:text-onSurfaceVariant={getLocale() !== 'es'}
				class:hover:bg-secondaryContainer={getLocale() !== 'es'}
				class:hover:text-onSecondaryContainer={getLocale() !== 'es'}
				onclick={() => switchLanguage('es')}
				title="Español"
			>
				<span class="text-sm">🇪🇸</span>
				ES
			</button>

			<div class="w-px bg-outlineVariant"></div>

			<button
				class="px-4 py-2 text-xs font-medium transition-all duration-200 ease-out
					   flex items-center gap-2 min-w-[60px] justify-center"
				class:bg-secondaryContainer={getLocale() === 'en'}
				class:text-onSecondaryContainer={getLocale() === 'en'}
				class:text-onSurfaceVariant={getLocale() !== 'en'}
				class:hover:bg-secondaryContainer={getLocale() !== 'en'}
				class:hover:text-onSecondaryContainer={getLocale() !== 'en'}
				onclick={() => switchLanguage('en')}
				title="English"
			>
				<span class="text-sm">🇺🇸</span>
				EN
			</button>
		</div>
	</div>
</div>
