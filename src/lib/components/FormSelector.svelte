<script lang="ts">
	export let value: string = 'haiku';
</script>

<select
	class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
	bind:value
>
	<!-- same options as PoemInput -->
</select>
