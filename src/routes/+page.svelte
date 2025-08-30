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
	<div class="text-center mb-8">
		<h1 class="text-4xl font-bold mb-2 text-onSurface">{m.app_title()}</h1>
		<p class="text-xl text-onSurfaceVariant">{m.app_subtitle()}</p>
	</div>

	<PoemEditor bind:lines={poemText} bind:form={selectedForm} />

	<div class="flex justify-center mt-6">
		<button class="btn-primary px-8 py-3" onclick={handleCheck} disabled={isLoading}>
			{isLoading ? m.checking() : m.check_poem()}
		</button>
	</div>

	{#if error}
		<div class="p-4 bg-errorContainer border border-error rounded-md mt-4">
			<p class="text-sm text-onErrorContainer">{error}</p>
		</div>
	{/if}

	{#if result}
		<ResultCard {result} />
	{/if}
</main>
