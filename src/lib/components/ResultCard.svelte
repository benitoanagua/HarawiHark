<script lang="ts">
	import { m } from '$lib/paraglide/messages.js';

	export let ok: boolean;
	export let lines: { text: string; count: number; expected: number }[];
	export let summary: string | undefined = undefined;
</script>

<div
	class="mt-4 p-4 rounded-md border"
	class:bg-green-50={ok}
	class:border-green-400={ok}
	class:bg-red-50={!ok}
	class:border-red-400={!ok}
>
	{#each lines as line}
		<div class="flex items-center gap-2 mb-1">
			<span class="flex-1 font-mono text-sm">{line.text}</span>
			<span
				class="text-xs tabular-nums px-2 py-1 rounded"
				class:text-green-600={line.count === line.expected}
				class:bg-green-100={line.count === line.expected}
				class:dark:bg-green-900={line.count === line.expected}
				class:text-red-600={line.count !== line.expected}
				class:bg-red-100={line.count !== line.expected}
				class:dark:bg-red-900={line.count !== line.expected}
			>
				{line.count}/{line.expected}
			</span>
		</div>
	{/each}

	<div class="mt-3 pt-2 border-t border-gray-200 dark:border-gray-600">
		<p
			class="text-sm font-semibold flex items-center gap-2"
			class:text-green-700={ok}
			class:text-red-700={!ok}
		>
			<span class="text-base">
				{ok ? '✅' : '❌'}
			</span>
			{ok ? m.pattern_matched() : m.pattern_mismatch()}
		</p>

		{#if summary}
			<p class="text-xs text-gray-600 dark:text-gray-400 mt-1">
				{summary}
			</p>
		{/if}
	</div>
</div>
