<script lang="ts">
	import { m } from '$lib/paraglide/messages.js';
	import PoemEditor from '$lib/components/poetry/PoemEditor.svelte';
	import ResultCard from '$lib/components/poetry/ResultCard.svelte';
	import { checkPoemRemote } from '$lib/services/poetry-checker.js';
	import { getCurrentLocale } from '$lib/services/i18n.js';

	let poemText = $state('');
	let selectedForm = $state('haiku');
	let result = $state<any>(null);
	let isLoading = $state(false);
	let error = $state('');

	const handleCheck = async () => {
		const lines = poemText.split('\n').filter((line) => line.trim());
		if (!lines.length) {
			error = m.error_at_least_one_line();
			return;
		}

		isLoading = true;
		error = '';
		result = null;

		try {
			result = await checkPoemRemote(lines, selectedForm, getCurrentLocale());
		} catch {
			error = m.error_unexpected();
		} finally {
			isLoading = false;
		}
	};

	const handleKeydown = (event: KeyboardEvent) => {
		if (event.ctrlKey && event.key === 'Enter') {
			event.preventDefault();
			handleCheck();
		}
	};
</script>

<svelte:window on:keydown={handleKeydown} />

<main class="max-w-2xl mx-auto p-4 md:p-8">
	<!-- Header mejorado pero simple -->
	<div class="text-center mb-8">
		<div class="flex items-center justify-center gap-3 mb-4">
			<div class="w-12 h-12 bg-primaryContainer rounded-full flex items-center justify-center">
				<span class="text-2xl">📝</span>
			</div>
			<h1 class="text-4xl font-bold text-onSurface">{m.app_title()}</h1>
		</div>
		<p class="text-xl text-onSurfaceVariant mb-4">{m.app_subtitle()}</p>

		<!-- Pequeños indicadores de características -->
		<div class="flex justify-center gap-4 text-sm text-onSurfaceVariant">
			<span class="flex items-center gap-1">
				<div class="w-1.5 h-1.5 bg-primary rounded-full"></div>
				Multilingual
			</span>
			<span class="flex items-center gap-1">
				<div class="w-1.5 h-1.5 bg-secondary rounded-full"></div>
				Real-time
			</span>
			<span class="flex items-center gap-1">
				<div class="w-1.5 h-1.5 bg-tertiary rounded-full"></div>
				Precise
			</span>
		</div>
	</div>

	<!-- Editor -->
	<PoemEditor bind:lines={poemText} bind:form={selectedForm} />

	<!-- Action section mejorado -->
	<div class="mt-6 text-center">
		<button class="btn-primary px-8 py-3 text-base" onclick={handleCheck} disabled={isLoading}>
			{#if isLoading}
				<span class="inline-flex items-center gap-2">
					<svg class="w-4 h-4 animate-spin" fill="currentColor" viewBox="0 0 24 24">
						<path d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z" />
					</svg>
					{m.checking()}
				</span>
			{:else}
				<span class="flex items-center gap-2">
					<span>✨</span>
					{m.check_poem()}
				</span>
			{/if}
		</button>

		<!-- Tip sutil -->
		<p class="text-xs text-onSurfaceVariant mt-2">
			Press <kbd class="bg-surfaceContainer px-1.5 py-0.5 rounded text-[10px]">Ctrl+Enter</kbd> for quick
			analysis
		</p>
	</div>

	<!-- Error con mejor diseño -->
	{#if error}
		<div class="bg-errorContainer border border-error rounded-xl p-4 mt-6 flex items-start gap-3">
			<span class="text-xl flex-shrink-0">⚠️</span>
			<div>
				<p class="text-sm font-medium text-onErrorContainer mb-1">Analysis Error</p>
				<p class="text-sm text-onErrorContainer/80">{error}</p>
			</div>
		</div>
	{/if}

	<!-- Results -->
	{#if result}
		<ResultCard {result} />
	{/if}

	<!-- Estado vacío sutil -->
	{#if !poemText.trim() && !result && !error}
		<div class="mt-12 text-center opacity-60">
			<div class="text-4xl mb-3">🌸</div>
			<p class="text-onSurfaceVariant">Start writing your poem above to see the magic happen</p>
		</div>
	{/if}
</main>
