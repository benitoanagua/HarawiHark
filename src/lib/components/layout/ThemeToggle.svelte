<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	let theme: 'light' | 'dark' = 'light';
	let mounted = false;

	function getSystemTheme(): 'light' | 'dark' {
		if (!browser) return 'light';
		return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
	}

	function applyTheme(newTheme: 'light' | 'dark') {
		if (!browser) return;
		document.documentElement.setAttribute('data-theme', newTheme);
		document.documentElement.classList.remove('light', 'dark');
		document.documentElement.classList.add(newTheme);
	}

	function toggleTheme() {
		theme = theme === 'light' ? 'dark' : 'light';
		applyTheme(theme);
		localStorage.setItem('theme', theme);
	}

	function initializeTheme() {
		if (!browser) return;

		// Primero intentar obtener el tema guardado
		const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;

		// Si no hay tema guardado, usar las preferencias del sistema
		if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
			theme = savedTheme;
		} else {
			theme = getSystemTheme();
		}

		applyTheme(theme);
	}

	// Listener para cambios en las preferencias del sistema
	function setupSystemThemeListener() {
		if (!browser) return;

		const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

		const handleSystemThemeChange = (e: MediaQueryListEvent) => {
			// Solo cambiar si no hay tema guardado por el usuario
			const savedTheme = localStorage.getItem('theme');
			if (!savedTheme) {
				theme = e.matches ? 'dark' : 'light';
				applyTheme(theme);
			}
		};

		// Usar addEventListener si está disponible, sino addListener (para compatibilidad)
		if (mediaQuery.addEventListener) {
			mediaQuery.addEventListener('change', handleSystemThemeChange);
		} else {
			mediaQuery.addListener(handleSystemThemeChange);
		}

		// Cleanup function
		return () => {
			if (mediaQuery.removeEventListener) {
				mediaQuery.removeEventListener('change', handleSystemThemeChange);
			} else {
				mediaQuery.removeListener(handleSystemThemeChange);
			}
		};
	}

	onMount(() => {
		initializeTheme();
		const cleanup = setupSystemThemeListener();
		mounted = true;

		// Cleanup al desmontar el componente
		return cleanup;
	});

	// Inicializar tema inmediatamente si estamos en el browser
	if (browser) {
		initializeTheme();
	}
</script>

<button
	on:click={toggleTheme}
	class="flex items-center justify-center w-9 h-9 rounded-full
		   bg-surfaceContainer hover:bg-surfaceContainerHigh
		   text-onSurface hover:shadow-md3
		   transition-all duration-200 ease-out
		   focus:outline-none focus:ring-2 focus:ring-primary/20
		   active:scale-95"
	aria-label={theme === 'light' ? 'Cambiar a tema oscuro' : 'Cambiar a tema claro'}
	title={theme === 'light' ? 'Cambiar a tema oscuro' : 'Cambiar a tema claro'}
>
	{#if mounted}
		{#if theme === 'light'}
			<span class="i-carbon:sun text-xl" aria-hidden="true"></span>
		{:else}
			<span class="i-carbon:moon text-xl" aria-hidden="true"></span>
		{/if}
	{:else}
		<!-- Skeleton loader -->
		<div class="w-5 h-5 bg-surfaceVariant animate-pulse rounded" aria-hidden="true"></div>
	{/if}
</button>
