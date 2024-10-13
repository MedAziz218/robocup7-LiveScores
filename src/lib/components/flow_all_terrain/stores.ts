import { writable, get } from 'svelte/store';
import { useSvelteFlow, useNodes } from '@xyflow/svelte';
import { type FitViewOptions } from '@xyflow/svelte';

export const isFullScreen = writable<boolean>(false);
export const focusedNode = writable<number>(1);
export const triggerFocusNodeAnimation = writable<boolean>(false);
export const XoffsetStore = writable<number>(250);
export const nodeHeightStore = writable<number>(100);
export const YoffsetStore = writable<number>(10);

export const focusNodeAnimation = writable({
	padding: 0.1,
	includeHiddenNodes: false,
	minZoom: 0.2,
	maxZoom: 2.25,
	duration: 1000
});
export function SaveConfig() {
	const configText = ConfigToString();
	localStorage.setItem('config-allterrain', configText);
}
export function loadConfig() {
	const configText = localStorage.getItem('config-allterrain');
	if (configText) {
		StringToConfig(configText);
	}
}

export function autoSaveConfig() {
	isFullScreen.subscribe((value) => {
		SaveConfig();
	});
	focusedNode.subscribe((value) => {
		SaveConfig();
	});
	triggerFocusNodeAnimation.subscribe((value) => {
		SaveConfig();
	});
	XoffsetStore.subscribe((value) => {
		SaveConfig();
	});
	nodeHeightStore.subscribe((value) => {
		SaveConfig();
	});
	YoffsetStore.subscribe((value) => {
		SaveConfig();
	});
	focusNodeAnimation.subscribe((value) => {
		SaveConfig();
	});
}
export function ConfigToString() {
	let configText = JSON.stringify(
		{
			isFullScreen: get(isFullScreen),
			focusedNode: get(focusedNode),
			triggerFocusNodeAnimation: get(triggerFocusNodeAnimation),
			XoffsetStore: get(XoffsetStore),
			nodeHeightStore: get(nodeHeightStore),
			YoffsetStore: get(YoffsetStore),
			focusNodeAnimation: get(focusNodeAnimation)
		},
		null,
		4
	); // Pretty-print JSON with 4-space indentation
	return configText;
}
export function StringToConfig(configText: string) {
	try {
		const updatedConfig = JSON.parse(configText);
		isFullScreen.set(updatedConfig.isFullScreen);
		focusedNode.set(updatedConfig.focusedNode);
		triggerFocusNodeAnimation.set(updatedConfig.triggerFocusNodeAnimation);
		XoffsetStore.set(updatedConfig.XoffsetStore);
		nodeHeightStore.set(updatedConfig.nodeHeightStore);
		YoffsetStore.set(updatedConfig.YoffsetStore);
		focusNodeAnimation.set(updatedConfig.focusNodeAnimation);
	} catch (e) {
		alert('Invalid JSON format, please correct the errors.');
	}
}
// Store to track full screen status (true = full screen on, false = full screen off)
