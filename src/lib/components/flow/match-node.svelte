<script lang="ts">
	import { Handle, Position, type NodeProps } from '@xyflow/svelte';
	import {
		ContextMenu,
		ContextMenuContent,
		ContextMenuItem,
		ContextMenuTrigger
	} from '$lib/components/ui/context-menu';
	type $$Props = NodeProps;
	export let data: $$Props['data'];

	type matchType = { id: number; teams: { id: number; name: string }[] };
	let match: matchType;
	$: if (data) {
		match = data.match as matchType;
	}

	function handleContextMenuAction(action: string, teamId: number) {
		console.log(`Action: ${action}, Team ID: ${teamId}`);
		// Implement your logic here
	}
</script>

<div class="absolute left-[-1rem] top-1/2 -translate-y-1/2 text-gray-300">
	{match.id}
</div>
<div class="overflow-hidden text-xs">
	{#each match.teams as team, index}
		<ContextMenu>
			<ContextMenuTrigger>
				<div class={`flex flex-row  ${index === 0 ? 'border-b border-gray-600' : ''}`}>
					<!-- Elegant dark background for team ID -->
					<div class=" w-[25px] h-[100%]  border-r bg-gray-700 py-1 text-center text-gray-300"
						>{team.id == -1 ? '-' : team.id}</div
					>
					<!-- Subtle contrast for team name with a smooth dark background -->
					<div class="w-full truncate text-left pl-1 bg-gray-800 py-1 text-gray-100">{team.name}</div>
				</div>
			</ContextMenuTrigger>
			<ContextMenuContent>
				<ContextMenuItem on:click={() => handleContextMenuAction('Edit', team.id)}>
					Set Winner {team.id}
				</ContextMenuItem>
				<ContextMenuItem on:click={() => handleContextMenuAction('Remove', team.id)}>
					Edit Team
				</ContextMenuItem>
			</ContextMenuContent>
		</ContextMenu>
	{/each}
</div>
<Handle type="source" position={Position.Right} />
<Handle type="target" position={Position.Left} />
