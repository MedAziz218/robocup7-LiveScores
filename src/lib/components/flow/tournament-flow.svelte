<script context="module" lang="ts">
	export interface TournamentFlowInteface {
		initTournament: (numberOfTeams: number) => void;
		setTopBracket: (bracketSize: 'all' | 64 | 32 | 16 | 8) => void;
		applyTeams: (teams: string[]) => void;
		// importTournament: (tournament: Tournament) => void;
		// getCurrentNumberOfTeams: ()=> number;
	}
</script>

<script lang="ts">
	import { writable } from 'svelte/store';
	import {
		SvelteFlow,
		Controls,
		Background,
		BackgroundVariant,
		MiniMap,
		ControlButton,
		type ColorMode,
		type NodeTypes,
		type Node,
		type Edge
	} from '@xyflow/svelte';
	import '@xyflow/svelte/dist/style.css';
	import MatchNode from './match-node.svelte';
	import { mode } from 'mode-watcher';
	import { onMount } from 'svelte';
	import {
		generateTournament,
		getNodesAndEdgesFromTournament,
		updateTournamentTeams,
		type Tournament
	} from './nodes-and-edges';
	import {
		ScreenShare as FullScreenIcon,
		Focus as FocusMatchIcon,
		SkipForward as FocusNextMatchIcon,
		SkipBack as FocusPreviousMatchIcon
	} from 'lucide-svelte';
	import { isFullScreen, focusedNode, triggerFocusNodeAnimation} from '$lib/components/flow/stores';
	import { focusNodeAnimation } from '$lib/components/flow/stores';

	import { useSvelteFlow, useNodes } from '@xyflow/svelte';
	const { zoomIn, zoomOut, setZoom, fitView, setCenter, setViewport, getViewport, viewport } =
		useSvelteFlow();
	$: if($triggerFocusNodeAnimation){
		fitView({ ...$focusNodeAnimation, nodes: [{ id: $focusedNode.toString() }] });
		$triggerFocusNodeAnimation = false
	}
	const { updateNodeData } = useSvelteFlow();
	const tournament = writable<Tournament>([]);
	const nodes = writable<Node[]>([]);
	const edges = writable<Edge[]>([]);
	const teamsList = writable<string[]>([]);
	const tournamentSize = writable(0);
	// Function to save store data to local storage
	function saveToLocalStorage() {
		// Convert the stores to JSON strings and save them in localStorage
		nodes.subscribe((value) => localStorage.setItem('nodes', JSON.stringify(value)));
		edges.subscribe((value) => localStorage.setItem('edges', JSON.stringify(value)));
		teamsList.subscribe((value) => localStorage.setItem('teamsList', JSON.stringify(value)));
	}

	// Function to load data from local storage into the stores
	function loadFromLocalStorage() {
		const savedNodes = localStorage.getItem('nodes');
		const savedEdges = localStorage.getItem('edges');
		const savedTeamsList = localStorage.getItem('teamsList');

		if (savedNodes) nodes.set(JSON.parse(savedNodes));
		if (savedEdges) edges.set(JSON.parse(savedEdges));
		if (savedTeamsList) teamsList.set(JSON.parse(savedTeamsList));
	}
	let colorMode: ColorMode = 'dark';
	export function setTeamsList(teamsNamesList: string[]): void {
		teamsList.set(teamsNamesList);
	}
	export function initTournament(numberOfTeams: number): void {
		$tournament = generateTournament(numberOfTeams);
		$tournamentSize = numberOfTeams;
	}
	export function setTopBracket(bracketSize: 'all' | 64 | 32 | 16 | 8): void {
		if (bracketSize === 'all') {
			$tournament = generateTournament($tournamentSize);
		} else {
			$tournament = generateTournament(bracketSize, $tournamentSize - bracketSize);
		}
	}
	export function applyTeams(teams: string[]): void {
		if ($tournamentSize !== teams.length) {
			initTournament(teams.length);
		}
		$tournament = updateTournamentTeams($tournament, teams);
	}

	export const saveTournament = (name: string) => {
		localStorage.setItem(name, JSON.stringify($tournament));
	};
	export const loadTournament = (name: string) => {
		const s = localStorage.getItem(name);
		let t: Tournament = [];
		if (s) {
			t = JSON.parse(s);
		}
		return t;
	};

	const nodeTypes = {
		match: MatchNode
	};
	const defaultEdgeOptions = {
		type: 'step',
		markerEnd: 'edge-circle'
	};
	const snapGrid: [number, number] = [25, 25];

	// const fitViewOptions = {
	// 	padding: 0.1,
	// 	includeHiddenNodes: false,
	// 	minZoom: 0.5,
	// 	maxZoom: 1.5,
	// 	duration: 1000,
	// 	nodes: [{ id: '1' }] // nodes to fit
	// };

	$: if ($tournament) {
		let [n, e] = getNodesAndEdgesFromTournament($tournament);

		$nodes = n;
		$edges = e;
	}

	$: if ($mode === 'light') {
		colorMode = 'light';
	} else if ($mode === 'dark') {
		colorMode = 'dark';
	} else {
		colorMode = 'system';
	}

	onMount(() => {
		loadFromLocalStorage();
		saveToLocalStorage();
		// initTournament(16);
	});
</script>

<!--
  👇 By default, the Svelte Flow container has a height of 100%.
  This means that the parent container needs a height to render the flow.
  -->
<div style:height="100%" style:width="100%">
	<SvelteFlow
		{nodes}
		{edges}
		{colorMode}
		{snapGrid}
		{nodeTypes}
		{defaultEdgeOptions}
		minZoom={0.1}
		maxZoom={2}
		fitView
		on:nodeclick={(event) => console.log('on node click', event.detail.node)}
	>
		<Controls
			style="transition-duration:300ms;"
			showLock={false}
			showZoom={false}
			showFitView={true}
		>
			<!-- class= "opacity-0 transition-opacity hover:opacity-60" -->
			<!-- <ControlButton on:click={() => console.log('⚡️')}>⚡️</ControlButton> -->
			<ControlButton
				on:click={() => {
					$isFullScreen = !$isFullScreen;
				}}><FullScreenIcon /></ControlButton
			>
			<ControlButton
				on:click={() => {
					$focusedNode = $focusedNode - 1;
					fitView({ ...$focusNodeAnimation, nodes: [{ id: $focusedNode.toString() }] });
				}}><FocusPreviousMatchIcon /></ControlButton
			>
			<ControlButton
				on:click={() => {
					fitView({ ...$focusNodeAnimation, nodes: [{ id: $focusedNode.toString() }] });
				}}><FocusMatchIcon /></ControlButton
			>
			<ControlButton
				on:click={() => {
					$focusedNode = $focusedNode + 1;
					fitView({ ...$focusNodeAnimation, nodes: [{ id: $focusedNode.toString() }] });
				}}><FocusNextMatchIcon /></ControlButton
			>
		</Controls>
		<Background variant={BackgroundVariant.Dots} />
		<MiniMap
			style="transition-duration:300ms;"
			class="opacity-0 transition-opacity hover:opacity-60"
		/>
	</SvelteFlow>
</div>
