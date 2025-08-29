<script lang="ts">
	import { m } from '$lib/paraglide/messages.js';
	import PoemInput from '$lib/components/PoemInput.svelte';
	import ResultCard from '$lib/components/ResultCard.svelte';

	let lines = $state('');
	let form = $state('haiku');
	let result = $state<{ ok: boolean; lines: any[] } | null>(null);
	let loading = $state(false);
	let error = $state<string | null>(null);

	async function handleCheck() {
		if (!lines.trim()) {
			error = 'Please enter some text';
			return;
		}

		loading = true;
		error = null;

		try {
			const body = {
				form,
				locale: document.documentElement.lang || 'en',
				lines: lines.split('\n').filter((line) => line.trim())
			};

			const res = await fetch('/api/check', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(body)
			});

			if (!res.ok) {
				throw new Error(`Server error: ${res.status}`);
			}

			result = await res.json();
		} catch (err) {
			error = err instanceof Error ? err.message : 'An error occurred';
			console.error('Check error:', err);
		} finally {
			loading = false;
		}
	}
</script>

<main class="max-w-xl mx-auto p-4">
	<h1 class="text-3xl font-bold mb-4">HarawiHark</h1>
	<p class="mb-6">{m.hello_world({ name: 'Poet' })}</p>

	<PoemInput bind:lines bind:form />

	{#if error}
		<div class="mt-3 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
			{error}
		</div>
	{/if}

	<button class="btn-primary mt-3" onclick={handleCheck} disabled={loading}>
		{loading ? '⏳' : m.check_poem()}
	</button>

	{#if result}
		<ResultCard {...result} />
	{/if}
</main>
