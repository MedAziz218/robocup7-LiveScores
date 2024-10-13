<script lang="ts">
	import CounterClockwiseClock from 'svelte-radix/CounterClockwiseClock.svelte';
	import {
		CodeViewer,
		MaxLengthSelector,
		ModelSelector,
		PresetActions,
		PresetSave,
		PresetNew,
		PresetLoad,
		PresetSelector,
		PresetShare,
		TemperatureSelector,
		TopPSelector
	} from '$lib/(components)/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import * as HoverCard from '$lib/components/ui/hover-card/index.js';
	import { LightSwtich, CsvUploader } from '$lib/components/custom';
	import { TournamentFlow } from '$lib/components/flow_all_terrain';

	import { isFullScreen,focusedNode, ConfigToString, StringToConfig ,autoSaveConfig,loadConfig} from '$lib/components/flow_all_terrain/stores';
	import type { TournamentFlowInteface } from '$lib/components/flow_all_terrain/tournament-flow.svelte';

	import { createModelList, type Model } from '$lib/(data)/models';
	import { DialogTextArea } from '$lib/components/custom';
	import { onMount } from 'svelte';
	import { useSvelteFlow, useNodes } from '@xyflow/svelte';

	const { zoomIn, zoomOut, setZoom, fitView, setCenter, setViewport, getViewport, viewport } =
		useSvelteFlow();
	let models: Model[] = [];
	let usefulCsvKeyIndexes: number[];
	let loadedCsvData: string[][];

	let TournamentFlowInstance: TournamentFlowInteface;
	let uploadButtonDisabled = false;
	function readFile(file: File): Promise<string> {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();

			reader.onload = () => {
				// Resolve the promise with the file content
				resolve(reader.result as string);
			};

			reader.onerror = () => {
				// Reject the promise in case of an error
				reject(reader.error);
			};

			// Read the file as text
			reader.readAsText(file);
		});
	}
	function processCsv(dataString: string) {
		const regex = /("[^"]+"|[^,]+)*,/g;

		// Split the CSV string into lines
		const lines = dataString.split(/\n/).map((lineStr) => lineStr.split(regex));

		// Extract keys (headers)
		const keys = lines[0];
		// Map each row to an object using the headers as keys
		return lines.map((arr) => {
			return arr.filter((val, i) => val || keys[i]);
		});
	}

	let settingsDialogComponent: DialogTextArea;
	let settingsString = '';
	function openSettingsDialog(onConfirm: () => void = () => {}) {
		settingsString = ConfigToString();
		settingsDialogComponent.openDialog(onConfirm);
	}
	function settingsDialogConfirm(event: CustomEvent<string>) {
		StringToConfig(settingsString);
		localStorage.setItem('config', settingsString);

	}

	let teamsDataDialogComponent: DialogTextArea;
	let teamsDataString = '';
	function applyTeams() {
		TournamentFlowInstance.applyTeams(teamsDataString.split('\n'));
	}
	function openTeamsDataDialog(onConfirm: () => void = () => {}) {
		teamsDataDialogComponent.openDialog(onConfirm);
	}
	function teamsDataDialogConfirm(event: CustomEvent<string>) {
		console.log('Confirmed text:', event.detail);
		localStorage.setItem('teamsDataString', teamsDataString);
		// Handle the confirmed text here
	}
	function generateTeams() {
		if (!loadedCsvData || !usefulCsvKeyIndexes) {
			return;
		}
		teamsDataString = '';
		for (let i = 1; i < loadedCsvData.length; i++) {
			const entry = loadedCsvData[i];
			for (let j = 0; j < usefulCsvKeyIndexes.length; j++) {
				if (entry[usefulCsvKeyIndexes[j]]) {
					teamsDataString += entry[usefulCsvKeyIndexes[j]].trim();
				} else {
					teamsDataString += '-';
				}

				if (j < usefulCsvKeyIndexes.length - 1) {
					teamsDataString += ' | ';
				}
			}
			teamsDataString += i<loadedCsvData.length-1 ? '\n' :'';
		}
		openTeamsDataDialog();
	}
	function resetAnimation() {
		fitView();
		$focusedNode = 0;
	}
	onMount(() => {
		const savedData = localStorage.getItem('teamsDataString');
		if (savedData) {
			teamsDataString = savedData; // Load saved data if it exists
		}
		loadConfig();
		autoSaveConfig();
	});

	// Save to localStorage whenever teamsDataString changes
</script>

<div class="md:hidden">
	<!-- <enhanced:img src={PlaygroundLight} alt="Playground" class="block dark:hidden" />
	<enhanced:img src={PlaygroundDark} alt="Playground" class="hidden dark:block" /> -->
</div>
<div class="flex h-screen flex-col">
	<DialogTextArea
		bind:this={teamsDataDialogComponent}
		on:confirm={teamsDataDialogConfirm}
		bind:textareaContent={teamsDataString}
		title="Teams Data"
	/>
	<DialogTextArea
		bind:this={settingsDialogComponent}
		on:confirm={settingsDialogConfirm}
		bind:textareaContent={settingsString}
		title="Teams Data"
	/>
	{#if !$isFullScreen}
		<div
			class="container flex flex-col items-start justify-between space-y-2 py-4 sm:flex-row sm:items-center sm:space-y-0 md:h-16"
		>
			<h2 class="text-lg font-semibold">Playground</h2>
			<div class="ml-auto flex w-full space-x-2 sm:justify-end">
				<!-- <PresetSelector {presets} /> -->
				<!-- <PresetNew/> -->
				<!-- <PresetLoad/> -->
				<!-- <PresetSave/> -->
				<CsvUploader
					bind:disabled={uploadButtonDisabled}
					on:confirm={async (e) => {
						if (e.detail.selectedFile) {
							uploadButtonDisabled = true;
							readFile(e.detail.selectedFile)
								.then((data) => {
									const processedData = processCsv(data);
									models = createModelList(processedData[0], 'key');
									loadedCsvData = processedData;
								})
								.catch(() => {
									uploadButtonDisabled = false;
								})
								.finally(() => {
									uploadButtonDisabled = false;
								});
						}
					}}
				/>
				<!-- <div class="hidden space-x-2 md:flex">
					<CodeViewer />
					<PresetShare />
				</div> -->
				<LightSwtich />
				<PresetActions openSettingFunction={openSettingsDialog} resetAnimationFunction={resetAnimation} />
			</div>
		</div>
		<Separator />
	{/if}
	<Tabs.Root value="complete" class="flex-1">
		<div class={'h-full ' + ($isFullScreen ? '' : 'container')}>
			<div
				class={'grid h-full items-stretch gap-6 ' +
					($isFullScreen ? '' : 'md:grid-cols-[1fr_200px]')}
			>
				{#if !$isFullScreen}
					<div class="order-1 flex-col space-y-4 sm:flex md:order-2">
						<div class="grid gap-2 py-6">
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
									Choose the interface that best suits your task. You can provide: a simple prompt
									to complete, starting and ending text to insert a completion within, or some text
									with instructions to edit it.
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
						<!-- <MultipleSelect {options}/> -->
						<ModelSelector
							bind:models
							bind:selectedIndexes={usefulCsvKeyIndexes}
							on:selectionChange={(e) => {
								console.log(e.detail.selectedIndexes);
							}}
						/>
						<Button
							on:click={generateTeams}
							disabled={!usefulCsvKeyIndexes?.length || !loadedCsvData}
							variant="outline">Generate teams</Button
						>
						<Button on:click={() => openTeamsDataDialog()} variant="secondary">Edit Teams</Button>
						<Button on:click={() => openTeamsDataDialog(applyTeams)} variant="default"
							>Apply Teams</Button
						>

						<!-- <TemperatureSelector value={[0.56]} />
					<MaxLengthSelector value={[256]} />
					<TopPSelector value={[0.9]} /> -->
					</div>
				{/if}

				<div class="md:order-1">
					<Tabs.Content value="complete" class="mt-0 h-full w-full border-0 p-0">
						<div class="flex h-full flex-col space-y-4">
							<TournamentFlow bind:this={TournamentFlowInstance} />
						</div>
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
