<script lang="ts">
	import CaretSort from 'svelte-radix/CaretSort.svelte';
	import { tick } from 'svelte';
	import type { Model, ModelType } from '../(data)/models.js';
	import ModelItem from './model-item.svelte';
	import * as HoverCard from '$lib/components/ui/hover-card/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Command from '$lib/components/ui/command/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { createEventDispatcher } from 'svelte';
	type ModelSelectEvent = {
		selectedIndexes: number[] ;
	};
	const dispatch = createEventDispatcher<{selectionChange:ModelSelectEvent}>();

	export let types: ModelType[];
	export let models: Model[];
	let selectedModels: Model[] = [];
	let peekedModel: Model | undefined = undefined;
	let open = false;

	// Modify `toggleModelSelection` to dispatch an event
	function toggleModelSelection(model: Model) {
		const index = selectedModels.findIndex((m) => m.id === model.id);
		if (index > -1) {
			// Deselect model if already selected
			selectedModels = selectedModels.filter((m) => m.id !== model.id);
		} else {
			// Select model if not selected
			selectedModels = [...selectedModels, model];
		}
		dispatch('selectionChange', { selectedIndexes: selectedModels.map((m,i) => i)} )

	}
	// Updating selected values to display all selected models
	$: selectedValue = selectedModels.length
		? selectedModels.map((m, i) => i).join(', ')
		: 'Select keys...';

	// Close the popover and refocus the trigger button
	function closeAndFocusTrigger(triggerId: string) {
		open = false;
		tick().then(() => {
			document.getElementById(triggerId)?.focus();
		});
	}

	function onPopoverOpenChange(open: boolean) {
		if (open) {
			peekedModel = undefined;
		} else {
			peekedModel = undefined;
		}
	}

	$: hoverCardIsOpen = open && peekedModel !== undefined;

	function handlePeek(model: Model) {
		if (peekedModel === undefined) {
			if (!open) return;
			peekedModel = model;
			return;
		}
		peekedModel = model;
	}

	function onPopoverOutsideClick() {
		peekedModel = undefined;
	}


</script>

<div class="grid gap-2">
	<HoverCard.Root openDelay={200}>
		<HoverCard.Trigger asChild let:builder>
			<div use:builder.action {...builder}>
				<Label for="model">Keys</Label>
			</div>
		</HoverCard.Trigger>
	</HoverCard.Root>

	<Popover.Root
		bind:open
		let:ids
		onOutsideClick={onPopoverOutsideClick}
		onOpenChange={onPopoverOpenChange}
	>
		<Popover.Trigger asChild let:builder>
			<Button
				builders={[builder]}
				variant="outline"
				role="combobox"
				aria-expanded={open}
				class="w-[200px] justify-between "
			>
				{selectedValue}
				<CaretSort class="ml-2 h-4 w-4 shrink-0 opacity-50" />
			</Button>
		</Popover.Trigger>
		<Popover.Content class="w-[250px] p-0">
			<HoverCard.Root
				closeOnOutsideClick={false}
				open={hoverCardIsOpen}
				openDelay={0}
				portal={null}
			>
				<!-- <HoverCard.Content class="-ml-2 min-h-[280px]" side="left" align="start">
					{#if peekedModel && hoverCardIsOpen}
						<div class="grid gap-2">
							<h4 class="font-medium leading-none">
								{peekedModel.name}
							</h4>
							<div class="text-muted-foreground text-sm">
								{peekedModel.description}
							</div>
							{#if peekedModel.strengths}
								<div class="mt-4 grid gap-2">
									<h5 class="text-sm font-medium leading-none">Strengths</h5>
									<ul class="text-muted-foreground text-sm">
										{peekedModel.strengths}
									</ul>
								</div>
							{/if}
						</div>
					{/if}
				</HoverCard.Content> -->
				<Command.Root loop>
					<Command.Input placeholder="Search Models...." />
					<Command.List class="h-[var(--cmdk-list-height)] max-h-[400px]">
						<Command.Empty>No models found.</Command.Empty>
						{#each types as type}
							<Command.Group heading={type}>
								{#each models.filter((model) => model.type === type) as model}
									<HoverCard.Trigger asChild let:builder>
										<div use:builder.action {...builder} role="button" tabindex={0}>
											<ModelItem
												{model}
												onSelect={() => {
													toggleModelSelection(model);
													closeAndFocusTrigger(ids.trigger);
												}}
												onPeek={() => {
													handlePeek(model);
												}}
												isSelected={selectedModels.some((m) => m.id === model.id)}
											/>
										</div>
									</HoverCard.Trigger>
								{/each}
							</Command.Group>
						{/each}
					</Command.List>
				</Command.Root>
			</HoverCard.Root>
		</Popover.Content>
	</Popover.Root>
</div>
