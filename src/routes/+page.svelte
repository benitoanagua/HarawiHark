<script lang="ts">
	import PoemInput from '$lib/components/PoemInput.svelte';
	import ResultCard from '$lib/components/ResultCard.svelte';
	import { m } from '$lib/paraglide/messages.js';

	let lines = [''];
	let form = 'haiku';
	let result: { ok: boolean; lines: any[] } | null = null;

	async function check() {
		const res = await fetch('/api/check', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ form, lines })
		});
		result = await res.json();
	}
</script>

<main class="max-w-xl mx-auto p-4">
	<h1 class="text-3xl font-bold mb-4">HarawiHark</h1>

	<PoemInput bind:lines bind:form />
	<button class="btn-primary mt-3" onclick={check}>{m.check_poem()}</button>

	{#if result}
		<ResultCard {...result} />
	{/if}
</main>
