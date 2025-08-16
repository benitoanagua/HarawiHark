<script lang="ts">
	import { m } from '$lib/paraglide/messages.js';
	import PoemInput from '$lib/components/PoemInput.svelte';
	import ResultCard from '$lib/components/ResultCard.svelte';

	let lines = $state('');
	let form = $state('haiku');
	let result = $state<{ ok: boolean; lines: any[] } | null>(null);
	let loading = $state(false);

	async function handleCheck() {
		loading = true;
		const body = {
			form,
			locale: 'en', // o detectar locale actual si lo necesitas
			lines: lines.split('\n').filter(Boolean)
		};
		const res = await fetch('/api/check', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(body)
		});
		result = await res.json();
		loading = false;
	}
</script>

<main class="max-w-xl mx-auto p-4">
	<h1 class="text-3xl font-bold mb-4">HarawiHark</h1>
	<p class="mb-6">{m.hello_world({ name: 'Poet' })}</p>

	<PoemInput bind:lines bind:form />

	<button class="btn-primary mt-3" onclick={handleCheck} disabled={loading}>
		{loading ? '⏳' : m.check_poem()}
	</button>

	{#if result}
		<ResultCard {...result} />
	{/if}
</main>
