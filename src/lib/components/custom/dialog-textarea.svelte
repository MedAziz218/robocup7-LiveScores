<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Textarea } from '$lib/components/ui/textarea';
	import * as Dialog from '$lib/components/ui/dialog';
	import { createEventDispatcher } from 'svelte';

	let dialogOpen = false;
	export let textareaContent = '';
    export let title = '';
    export let description = '';
	const dispatch = createEventDispatcher();

	function handleConfirm() {
		dispatch('confirm', textareaContent);
		dialogOpen = false;
        tempOnConfirm();
	}
    let tempOnConfirm = () => {};
	export function openDialog(onConfirm: () => void) {
        if (dialogOpen)return;
        tempOnConfirm = onConfirm;
		dialogOpen = true;
	}
    $: if (!dialogOpen) tempOnConfirm = () => {};
</script>

<Dialog.Root bind:open={dialogOpen}>
	<Dialog.Content class="sm:max-w-[50%]">
		<Dialog.Header>
			<Dialog.Title>{title}</Dialog.Title>
			<Dialog.Description>{description}</Dialog.Description>
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
