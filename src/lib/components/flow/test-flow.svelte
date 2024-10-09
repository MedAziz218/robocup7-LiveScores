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
	import { mode } from 'mode-watcher';
	// 👇 this is important! You need to import the styles for Svelte Flow to work
	import '@xyflow/svelte/dist/style.css';

	// We are using writables for the nodes and edges to sync them easily. When a user drags a node for example, Svelte Flow updates its position.
	import { initialNodes, initialEdges } from './nodes-and-edges';

	const nodes = writable<Node[]>(initialNodes);

	const edges = writable<Edge[]>(initialEdges);

	const snapGrid: [number, number] = [25, 25];

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
		fitView
		on:nodeclick={(event) => console.log('on node click', event.detail.node)}
	>
		<Controls />
		<Background variant={BackgroundVariant.Dots} />
		<MiniMap style="transition-duration:300ms;" class="opacity-0 hover:opacity-60 transition-opacity" />
	</SvelteFlow>
</div>
