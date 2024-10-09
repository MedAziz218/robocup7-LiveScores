<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import {
		Dialog,
		DialogContent,
		DialogDescription,
		DialogFooter,
		DialogHeader,
		DialogTitle,
		DialogTrigger
	} from '$lib/components/ui/dialog';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Upload } from 'lucide-svelte';

	let dialogOpen = false;
	let dragActive = false;
	let selectedFile: File | null = null;

	function handleFileSelect(event: Event) {
		console.log('handleFileSelect called');
		const input = event.target as HTMLInputElement;
		if (input.files && input.files.length > 0) {
			selectedFile = input.files[0];
		}
	}

	function handleDragOver(event: DragEvent) {
		event.preventDefault();
		dragActive = true;
	}

	function handleDragLeave() {
		dragActive = false;
	}

	function handleDrop(event: DragEvent) {
		event.preventDefault();
		dragActive = false;
		if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
			selectedFile = event.dataTransfer.files[0];
		}
	}

	function handleConfirm() {
		// Placeholder function for confirming the upload
		console.log('Confirm clicked, file:', selectedFile);
		dialogOpen = false;
	}

	function handleCancel() {
		// Placeholder function for canceling the upload
		console.log('Cancel clicked');
		selectedFile = null;
		dialogOpen = false;
	}
</script>

<Dialog bind:open={dialogOpen}>
	<DialogTrigger asChild let:builder>
		<Button builders={[builder]} variant="secondary">
			<Upload class="mr-2 h-4 w-4" />
			Upload CSV
		</Button>
	</DialogTrigger>
	<DialogContent class="sm:max-w-[425px]">
		<DialogHeader>
			<DialogTitle>Upload CSV File</DialogTitle>
			<DialogDescription>
				Upload a CSV file by selecting it or dragging and dropping it into the designated area.
			</DialogDescription>
		</DialogHeader>
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div
			class="grid w-full max-w-sm items-center gap-1.5"
			on:dragover={handleDragOver}
			on:dragleave={handleDragLeave}
			on:drop={handleDrop}
		>
			<Label for="csv-file">CSV File</Label>
			<div
				class={`relative flex h-32 w-full flex-col items-center justify-center rounded-lg border-2 border-dashed ${
					dragActive ? 'border-primary' : 'border-gray-300'
				} ${dragActive ? 'bg-primary/10' : 'bg-gray-50'}`}
			>
				{#if selectedFile}
					<p class="text-sm text-gray-600">{selectedFile.name}</p>
				{:else}
					<p class="text-sm text-gray-600">Drag and drop your CSV file here, or click to select</p>
				{/if}
				<Input
					id="csv-file"
					type="file"
					accept=".csv"
					on:change={handleFileSelect}
					class="absolute inset-0 h-full w-full cursor-pointer opacity-0"
				/>
			</div>
		</div>
		<DialogFooter>
			<Button on:click={handleConfirm}>Confirm</Button>
			<Button variant="outline" on:click={handleCancel}>Cancel</Button>
		</DialogFooter>
	</DialogContent>
</Dialog>
