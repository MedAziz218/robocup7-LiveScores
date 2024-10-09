<script lang="ts">
	import CounterClockwiseClock from 'svelte-radix/CounterClockwiseClock.svelte';
	import {
		CodeViewer,
		MaxLengthSelector,
		ModelSelector,
		PresetActions,
		PresetSave,
		PresetSelector,
		PresetShare,
		TemperatureSelector,
		TopPSelector
	} from '$lib/(components)/index.js';
	import { models, types } from '$lib/(data)/models.js';
	import { presets } from '$lib/(data)/presets.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import * as HoverCard from '$lib/components/ui/hover-card/index.js';
	import { LightSwtich } from '$lib/components/custom';
	// import PlaygroundLight from "$lib/img/examples/playground-light.png?enhanced";
	// import PlaygroundDark from "$lib/img/examples/playground-dark.png?enhanced";
</script>

<div class="md:hidden">
	<!-- <enhanced:img src={PlaygroundLight} alt="Playground" class="block dark:hidden" />
	<enhanced:img src={PlaygroundDark} alt="Playground" class="hidden dark:block" /> -->
</div>
<div class="hidden h-screen flex-col md:flex">
	<div
		class="container flex flex-col items-start justify-between space-y-2 py-4 sm:flex-row sm:items-center sm:space-y-0 md:h-16"
	>
		<h2 class="text-lg font-semibold">Playground</h2>
		<div class="ml-auto flex w-full space-x-2 sm:justify-end">
			<PresetSelector {presets} />
			<PresetSave />
			<div class="hidden space-x-2 md:flex">
				<CodeViewer />
				<PresetShare />
			</div>
			<LightSwtich />
			<PresetActions />
		</div>
	</div>
	<Separator />
	<Tabs.Root value="complete" class="flex-1">
		<div class="container h-full py-6">
			<div class="grid h-full items-stretch gap-6 md:grid-cols-[1fr_200px]">
				<div class="hidden flex-col space-y-4 sm:flex md:order-2">
					<div class="grid gap-2">
						<HoverCard.Root openDelay={200}>
							<HoverCard.Trigger asChild let:builder>
								<span
									class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
									use:builder.action
									{...builder}
								>
									Mode
								</span>
							</HoverCard.Trigger>
							<HoverCard.Content class="w-[320px] text-sm" side="left">
								Choose the interface that best suits your task. You can provide: a simple prompt to
								complete, starting and ending text to insert a completion within, or some text with
								instructions to edit it.
							</HoverCard.Content>
						</HoverCard.Root>
						<Tabs.List class="grid grid-cols-3">
							<Tabs.Trigger value="complete">
								<span class="sr-only">Complete</span>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 20 20"
									fill="none"
									class="h-5 w-5"
								>
									<rect x="4" y="3" width="12" height="2" rx="1" fill="currentColor" />
									<rect x="4" y="7" width="12" height="2" rx="1" fill="currentColor" />
									<rect x="4" y="11" width="3" height="2" rx="1" fill="currentColor" />
									<rect x="4" y="15" width="3" height="2" rx="1" fill="currentColor" />
									<rect x="8.5" y="11" width="3" height="2" rx="1" fill="currentColor" />
									<rect x="8.5" y="15" width="3" height="2" rx="1" fill="currentColor" />
									<rect x="13" y="11" width="3" height="2" rx="1" fill="currentColor" />
								</svg>
							</Tabs.Trigger>
							<Tabs.Trigger value="insert">
								<span class="sr-only">Insert</span>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 20 20"
									fill="none"
									class="h-5 w-5"
								>
									<path
										fill-rule="evenodd"
										clip-rule="evenodd"
										d="M14.491 7.769a.888.888 0 0 1 .287.648.888.888 0 0 1-.287.648l-3.916 3.667a1.013 1.013 0 0 1-.692.268c-.26 0-.509-.097-.692-.268L5.275 9.065A.886.886 0 0 1 5 8.42a.889.889 0 0 1 .287-.64c.181-.17.427-.267.683-.269.257-.002.504.09.69.258L8.903 9.87V3.917c0-.243.103-.477.287-.649.183-.171.432-.268.692-.268.26 0 .509.097.692.268a.888.888 0 0 1 .287.649V9.87l2.245-2.102c.183-.172.432-.269.692-.269.26 0 .508.097.692.269Z"
										fill="currentColor"
									/>
									<rect x="4" y="15" width="3" height="2" rx="1" fill="currentColor" />
									<rect x="8.5" y="15" width="3" height="2" rx="1" fill="currentColor" />
									<rect x="13" y="15" width="3" height="2" rx="1" fill="currentColor" />
								</svg>
							</Tabs.Trigger>
							<Tabs.Trigger value="edit">
								<span class="sr-only">Edit</span>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 20 20"
									fill="none"
									class="h-5 w-5"
								>
									<rect x="4" y="3" width="12" height="2" rx="1" fill="currentColor" />
									<rect x="4" y="7" width="12" height="2" rx="1" fill="currentColor" />
									<rect x="4" y="11" width="3" height="2" rx="1" fill="currentColor" />
									<rect x="4" y="15" width="4" height="2" rx="1" fill="currentColor" />
									<rect x="8.5" y="11" width="3" height="2" rx="1" fill="currentColor" />
									<path
										d="M17.154 11.346a1.182 1.182 0 0 0-1.671 0L11 15.829V17.5h1.671l4.483-4.483a1.182 1.182 0 0 0 0-1.671Z"
										fill="currentColor"
									/>
								</svg>
							</Tabs.Trigger>
						</Tabs.List>
					</div>
					<ModelSelector {types} {models} />
					<TemperatureSelector value={[0.56]} />
					<MaxLengthSelector value={[256]} />
					<TopPSelector value={[0.9]} />
				</div>
				<div class="md:order-1">
					<Tabs.Content value="complete" class="mt-0 h-full w-full border-0 p-0">
						<div class="flex h-full flex-col space-y-4">placeholder1</div>
					</Tabs.Content>
					<Tabs.Content value="insert" class="mt-0 h-full w-full border-0 p-0">
						<div class="flex flex-col space-y-4">placeholder2</div>
					</Tabs.Content>
					<Tabs.Content value="edit" class="mt-0 h-full w-full border-0 p-0">
						<div class="flex flex-col space-y-4">placeholder3</div>
					</Tabs.Content>
				</div>
			</div>
		</div>
	</Tabs.Root>
</div>
