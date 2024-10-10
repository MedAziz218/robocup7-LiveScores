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
	import { initialNodes, initialEdges } from './nodes-and-edges';
	import { mode } from 'mode-watcher';
	const nodes = writable<Node[]>(initialNodes);

	const edges = writable<Edge[]>(initialEdges);
	const nodeTypes = {
		participant: ParticipantNode,
		match: MatchNode
	};
	const defaultEdgeOptions = {
		type: 'smoothstep',
		markerEnd: 'edge-circle'
	};
	const snapGrid: [number, number] = [25, 25];

	const fitViewOptions = {
		padding: 0.1,
		includeHiddenNodes: false,
		minZoom: 0.5,
		maxZoom: 1.5,
		duration: 1000,
		nodes: [{ id: '49' } ] // nodes to fit
	};
	let colorMode: ColorMode = 'dark';
	$: if ($mode === 'light') {
		colorMode = 'light';
	} else if ($mode === 'dark') {
		colorMode = 'dark';
	} else {
		colorMode = 'system';
	}
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
        {fitViewOptions}
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
