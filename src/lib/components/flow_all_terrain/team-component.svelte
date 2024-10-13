<script lang="ts">
	import { focusedNode } from './stores';
	export let teamid: number;
	export let teamName: string;
	export let matchid: number;
	export let mode: 'winner' | 'loser' | 'default' = 'default';

	const randomTextAnimDuration = 500;
	let hideText = false;
	let canAnimate = teamid != -1;
	let hiddenText = '*********';
	let currentText = hiddenText;
	$: displayName = !canAnimate ? teamName : hideText && teamid != -1 ? currentText : teamName;

	$: if ($focusedNode == 0 && teamid !== -1) {
		hideText = true;
		currentText = hiddenText;
	}
	$: if ($focusedNode === matchid && hideText) {
		setTimeout(() => startAimation(), 800);
	}
	$: idDisplay = teamid === -1 ? '-' : teamid;
	$: ariaLabel = `Team ID: ${teamid === -1 ? 'Not available' : teamid}, Status: ${mode}`;
	function startAimation() {
		currentText = '';
		let lastIndex = 0;
		let interval = setInterval(() => {
			currentText += teamName[lastIndex];
			lastIndex++;
			if (lastIndex >= teamName.length) {
				clearInterval(interval);
				hideText = false;
			}
		}, randomTextAnimDuration / teamName.length);
	}
</script>

<div
	class="flex items-center transition-colors duration-200 ease-in-out
           hover:bg-gray-100 dark:hover:bg-gray-700"
	class:winner={mode === 'winner'}
	class:loser={mode === 'loser'}
>
	<div
		class="flex h-[100%] w-[25px] items-center justify-center border-r
             border-gray-300 bg-gray-200 py-1
             font-semibold text-gray-700
             dark:border-gray-600 dark:bg-[#E2AC0D]"
		aria-label={ariaLabel}
	>
		{idDisplay}
	</div>
	<div
		class="w-full truncate bg-white py-1 pl-1 text-left text-gray-800
             hover:bg-gray-100 dark:bg-[#E1DBBD]
             dark:hover:bg-gray-300"
	>
		{#if mode === 'winner'}
			<span class="font-bold">🏆 {teamName}</span>
		{:else if mode === 'loser'}
			<span class="line-through">{teamName}</span>
		{:else}
			{displayName}
		{/if}
	</div>
</div>

<style>
	.winner {
		background-color: rgba(154, 230, 180, 0.3);
		border-left: 4px solid #48bb78;
	}

	.winner:hover {
		background-color: rgba(154, 230, 180, 0.5) !important;
	}

	.loser {
		opacity: 0.6;
		background-color: rgba(254, 178, 178, 0.1);
	}

	.loser:hover {
		background-color: rgba(254, 178, 178, 0.2) !important;
	}

	:global(.dark) .winner {
		background-color: rgba(74, 222, 128, 0.1);
		border-left: 4px solid #22c55e;
	}

	:global(.dark) .winner:hover {
		background-color: rgba(74, 222, 128, 0.2) !important;
	}

	:global(.dark) .loser {
		opacity: 0.6;
		background-color: rgba(248, 113, 113, 0.1);
	}

	:global(.dark) .loser:hover {
		background-color: rgba(248, 113, 113, 0.2) !important;
	}
</style>
