<script lang="ts">
	import { m } from '$lib/paraglide/messages.js';
	import PoemInput from '$lib/components/PoemInput.svelte';
	import ResultCard from '$lib/components/ResultCard.svelte';

	let lines = $state('');
	let form = $state('haiku');
	let result = $state<{ ok: boolean; lines: any[]; summary?: string } | null>(null);
	let loading = $state(false);
	let error = $state<string | null>(null);

	async function handleCheck() {
		const cleanLines = lines.split('\n').filter((line) => line.trim());

		if (cleanLines.length === 0) {
			error = 'Please enter at least one line of poetry';
			return;
		}

		loading = true;
		error = null;
		result = null;

		try {
			const body = {
				form,
				locale: document.documentElement.lang || 'en',
				lines: cleanLines
			};

			const res = await fetch('/api/check', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(body)
			});

			if (!res.ok) {
				const errorData = await res.json().catch(() => ({}));
				throw new Error(errorData.error || `Server error: ${res.status}`);
			}

			const data = await res.json();
			result = data;

			// Scroll suave al resultado
			setTimeout(() => {
				document.querySelector('#result')?.scrollIntoView({
					behavior: 'smooth',
					block: 'start'
				});
			}, 100);
		} catch (err) {
			error = err instanceof Error ? err.message : 'An unexpected error occurred';
			console.error('Check error:', err);
		} finally {
			loading = false;
		}
	}

	// Función para manejar Enter en el textarea (opcional)
	function handleKeydown(event: KeyboardEvent) {
		if (event.ctrlKey && event.key === 'Enter') {
			event.preventDefault();
			handleCheck();
		}
	}
</script>

<svelte:window on:keydown={handleKeydown} />

<main class="max-w-2xl mx-auto p-4 md:p-6">
	<!-- Header -->
	<header class="text-center mb-8">
		<h1 class="text-4xl font-bold mb-2 text-gray-900 dark:text-gray-100">HarawiHark</h1>
		<p class="text-lg text-gray-600 dark:text-gray-300 mb-1">Syllable Pattern Checker for Poetry</p>
		<p class="text-sm text-gray-500 dark:text-gray-400">
			{m.hello_world({ name: 'Poet' })} • Press Ctrl+Enter to check
		</p>
	</header>

	<!-- Main form -->
	<div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
		<PoemInput bind:lines bind:form />

		<!-- Error display -->
		{#if error}
			<div
				class="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-md"
			>
				<div class="flex items-center">
					<span class="text-sm">⚠️ {error}</span>
				</div>
			</div>
		{/if}

		<!-- Check button -->
		<button
			class="btn-primary mt-4 w-full sm:w-auto"
			onclick={handleCheck}
			disabled={loading || !lines.trim()}
			class:opacity-50={loading || !lines.trim()}
			class:cursor-not-allowed={loading || !lines.trim()}
		>
			{#if loading}
				<span class="inline-flex items-center">
					<svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
						<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
						></circle>
						<path
							class="opacity-75"
							fill="currentColor"
							d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
						></path>
					</svg>
					Checking...
				</span>
			{:else}
				🔍 {m.check_poem()}
			{/if}
		</button>
	</div>

	<!-- Results -->
	{#if result}
		<div id="result" class="scroll-mt-4">
			<ResultCard {...result} />

			{#if result.summary}
				<div
					class="mt-4 p-3 rounded-md border text-sm"
					class:bg-green-50={result.ok}
					class:border-green-300={result.ok}
					class:text-green-800={result.ok}
					class:bg-red-50={!result.ok}
					class:border-red-300={!result.ok}
					class:text-red-800={!result.ok}
				>
					{result.summary}
				</div>
			{/if}
		</div>
	{/if}

	<!-- Footer info -->
	<footer class="mt-12 text-center text-xs text-gray-500 dark:text-gray-400">
		<p class="mb-2">
			Powered by <a
				href="https://github.com/quantified-uncertainty/simi-syllable"
				class="text-blue-600 hover:text-blue-800 dark:text-blue-400"
				target="_blank"
				rel="noopener">simi-syllable</a
			>
		</p>
		<p>
			<a href="/docs" class="text-blue-600 hover:text-blue-800 dark:text-blue-400">
				📚 Documentation
			</a>
			•
			<a href="/api/check" class="text-blue-600 hover:text-blue-800 dark:text-blue-400"> 🔗 API </a>
		</p>
	</footer>
</main>
