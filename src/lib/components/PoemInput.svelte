<script lang="ts">
	export let lines: string[] = [];
	export let form: string = 'haiku';
</script>

<textarea
	class="w-full h-32 p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm resize-none"
	bind:value={lines}
	placeholder="Paste each line↵ on a new line…"
></textarea>

<select
	class="mt-2 w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm"
	bind:value={form}
>
	<option value="haiku">Haiku (5-7-5)</option>
	<option value="tanka">Tanka (5-7-5-7-7)</option>
	<option value="cinquain">Cinquain (2-4-6-8-2)</option>
	<option value="nonet">Nonet (9-…-1)</option>
	<option value="etheree">Etheree (1-…-10)</option>
	<option value="fib">Fibonacci (1-1-2-3-5-8)</option>
	<option value="lanterne">Lanterne (1-2-3-4-1)</option>
	<option value="gogyoka">Gogyōka</option>
	<option value="rondel-supreme">Rondel Supreme</option>
	<option value="sapphic-stanza">Sapphic Stanza</option>
</select>
