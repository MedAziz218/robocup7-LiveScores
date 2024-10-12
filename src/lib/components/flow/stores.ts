import { writable, get } from 'svelte/store';
import { useSvelteFlow, useNodes } from '@xyflow/svelte';
import { type FitViewOptions } from '@xyflow/svelte';

export const isFullScreen = writable<boolean>(false);
export const focusedNode = writable<number>(1);
export const triggerFocusNodeAnimation = writable<boolean>(false);


export const focusNodeAnimation = writable({
	padding: 0.1,
	includeHiddenNodes: false,
	minZoom: 0.2,
	maxZoom: 2.25,
	duration: 1000
	// nodes: [{ id: get(focusedNode).toString() }] // nodes to fit
});

// Store to track full screen status (true = full screen on, false = full screen off)
