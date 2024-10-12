<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Textarea } from '$lib/components/ui/textarea';
	import * as Dialog from '$lib/components/ui/dialog';
	import { createEventDispatcher } from 'svelte';
	import {
		isFullScreen,
		focusedNode,
		triggerFocusNodeAnimation,
		XoffsetStore,
		nodeHeightStore,
		YoffsetStore,
		focusNodeAnimation
	} from './stores';

	let dialogOpen = false;
	export let textareaContent = '';
	export let title = '';
	export let description = '';
	const dispatch = createEventDispatcher();

	function handleConfirm() {
		try {
			const updatedConfig = JSON.parse(configText);
			isFullScreen.set(updatedConfig.isFullScreen);
			focusedNode.set(updatedConfig.focusedNode);
			triggerFocusNodeAnimation.set(updatedConfig.triggerFocusNodeAnimation);
			XoffsetStore.set(updatedConfig.XoffsetStore);
			nodeHeightStore.set(updatedConfig.nodeHeightStore);
			YoffsetStore.set(updatedConfig.YoffsetStore);
			focusNodeAnimation.set(updatedConfig.focusNodeAnimation);
			dispatch('confirm', textareaContent);
			dialogOpen = false;
			tempOnConfirm();
		} catch (e) {
			alert('Invalid JSON format, please correct the errors.');
		}
	}
	let tempOnConfirm = () => {};
	export function openDialog(onConfirm: () => void) {
		if (dialogOpen) return;
		tempOnConfirm = onConfirm;
		dialogOpen = true;

		configText = JSON.stringify(
			{
				isFullScreen: $isFullScreen,
				focusedNode: $focusedNode,
				triggerFocusNodeAnimation: $triggerFocusNodeAnimation,
				XoffsetStore: $XoffsetStore,
				nodeHeightStore: $nodeHeightStore,
				YoffsetStore: $YoffsetStore,
				focusNodeAnimation: $focusNodeAnimation
			},
			null,
			4
		); // Pretty-print JSON with 4-space indentation
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
