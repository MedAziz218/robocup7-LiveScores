<script context="module" lang="ts">
	export interface TournamentFlowInteface {
		initTournament: (numberOfTeams: number) => void;
		setTopBracket: (bracketSize: 'all' | 64 | 32 | 16 | 8) => void;
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
		type ColorMode,
		type NodeTypes,
		type Node,
		type Edge
	} from '@xyflow/svelte';
	import '@xyflow/svelte/dist/style.css';
	import ParticipantNode from './participant-node.svelte';
	import MatchNode from './match-node.svelte';
	import { mode } from 'mode-watcher';
	import { onMount } from 'svelte';
	import {
		generateTournament,
		getNodesAndEdgesFromTournament,
		type Tournament
	} from './nodes-and-edges';

	const tournament = writable<Tournament>([]);
	const nodes = writable<Node[]>([]);
	const edges = writable<Edge[]>([]);
	const teamsList = writable<string[]>([]);
	const tournamentSize = writable(0);

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
		participant: ParticipantNode,
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
		initTournament(16);
		setTimeout(() => {
			$tournament = $tournament.map((round) => {
				return round.map((match, i) => {
					match.teams = [
						{ id: 0, name: 'pp' },
						{ id: 1, name: 'qq' }
					];
					return match;
				});
			});
			console.log('trah jarrab');
		}, 4000);
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
		<Controls />
		<Background variant={BackgroundVariant.Dots} />
		<MiniMap
			style="transition-duration:300ms;"
			class="opacity-0 transition-opacity hover:opacity-60"
		/>
	</SvelteFlow>
</div>
