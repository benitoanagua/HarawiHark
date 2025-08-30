<script lang="ts">
	import { m } from '$lib/paraglide/messages.js';
	import PoemEditor from '$lib/components/poetry/PoemEditor.svelte';
	import ResultCard from '$lib/components/poetry/ResultCard.svelte';
	import { checkPoemRemote } from '$lib/services/poetry-checker.js';
	import { getCurrentLocale } from '$lib/services/i18n.js';
	import type { PoetryAnalysisResult } from '$lib/models/poetry.js';

	let poemText = '';
	let selectedForm = 'haiku';
	let result: PoetryAnalysisResult | null = null;
	let isLoading = false;
	let error = '';

	async function handleCheck() {
		if (!poemText.trim()) {
			error = m.error_at_least_one_line();
			return;
		}

		const lines = poemText.split('\n').filter((line) => line.trim());
		if (lines.length === 0) {
			error = m.error_at_least_one_line();
			return;
		}

		isLoading = true;
		error = '';

		try {
			result = await checkPoemRemote(lines, selectedForm, getCurrentLocale());
		} catch (err) {
			error = err instanceof Error ? err.message : m.error_unexpected();
		} finally {
			isLoading = false;
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.ctrlKey && event.key === 'Enter') {
			event.preventDefault();
			handleCheck();
		}
	}
</script>

<svelte:head>
	<title>{m.app_title()} - {m.app_subtitle()}</title>
	<meta name="description" content={m.app_description()} />
</svelte:head>

<svelte:window on:keydown={handleKeydown} />

<main class="max-w-2xl mx-auto p-4 md:p-8">
	<div class="text-center mb-8">
		<h1 class="text-4xl font-bold mb-2 text-gray-900 dark:text-gray-100">
			{m.app_title()}
		</h1>
		<p class="text-xl text-gray-600 dark:text-gray-400 mb-4">
			{m.app_subtitle()}
		</p>
		<p class="text-sm text-gray-500 dark:text-gray-500">
			{m.press_ctrl_enter()}
		</p>
	</div>

	<div class="space-y-6">
		<PoemEditor bind:lines={poemText} bind:form={selectedForm} />

		<div class="flex justify-center">
			<button
				type="button"
				class="btn-primary px-8 py-3"
				onclick={handleCheck}
				disabled={isLoading}
			>
				{isLoading ? m.checking() : m.check_poem()}
			</button>
		</div>

		{#if error}
			<div
				class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md"
			>
				<p class="text-sm text-red-600 dark:text-red-400">{error}</p>
			</div>
		{/if}

		{#if result}
			<ResultCard
				ok={result.ok}
				lines={result.lines.map((line) => ({
					text: line.text,
					count: line.count,
					expected: line.expected
				}))}
				summary={result.summary}
			/>
		{/if}
	</div>
</main>
