<script lang="ts">
	export let lines: { text: string; count: number; expected: number }[];
	export let ok: boolean;
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
				class="text-xs tabular-nums"
				class:text-green-600={line.count === line.expected}
				class:text-red-600={line.count !== line.expected}
			>
				{line.count}/{line.expected}
			</span>
		</div>
	{/each}

	<p class="mt-2 text-sm font-semibold" class:text-green-700={ok} class:text-red-700={!ok}>
		{ok ? '✅ Pattern matched' : '❌ Pattern mismatch'}
	</p>
</div>
