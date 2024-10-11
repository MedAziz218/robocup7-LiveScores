<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Textarea } from '$lib/components/ui/textarea';
	import * as Dialog from '$lib/components/ui/dialog';
	import { createEventDispatcher } from 'svelte';

	let dialogOpen = false;
	export let textareaContent = '';

	const dispatch = createEventDispatcher();

	function handleConfirm() {
		dispatch('confirm', textareaContent);
		dialogOpen = false;
	}

	export function openDialog() {
		dialogOpen = true;
	}
</script>

<Dialog.Root bind:open={dialogOpen}>
	<Dialog.Content class="sm:max-w-[50%]">
		<Dialog.Header>
			<Dialog.Title>Enter Text</Dialog.Title>
			<Dialog.Description>Please enter your text in the textarea below.</Dialog.Description>
		</Dialog.Header>
		<div class="grid gap-4 py-4">
			<Textarea
				bind:value={textareaContent}
				placeholder="Type your text here..."
				class="min-h-[200px]"
			/>
		</div>
		<Dialog.Footer>
			<Button variant="outline" on:click={() => (dialogOpen = false)}>Cancel</Button>
			<Button on:click={handleConfirm}>Confirm</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
