<script lang="ts">
	import { Handle, Position, type NodeProps } from '@xyflow/svelte';
	import {
		ContextMenu,
		ContextMenuContent,
		ContextMenuItem,
		ContextMenuTrigger,
		ContextMenuSeparator,
		ContextMenuSub
	} from '$lib/components/ui/context-menu';
	import { focusedNode, triggerFocusNodeAnimation } from '$lib/components/flow/stores';
	import TeamComponent from './team-component.svelte';
	import {
		useNodes,
		useHandleConnections,
		useNodesData,
		useSvelteFlow,
		useConnection,
		useEdges
	} from '@xyflow/svelte';

	const { updateNodeData } = useSvelteFlow();
	type $$Props = NodeProps;
	// export let id: $$Props['id'];
	export let data: $$Props['data'];

	type matchType = { id: number; winnerGoesTo: number;winnerID: number ; teams: { id: number; name: string }[],};
	let match: matchType;
	$: if (data) {
		match = data.match as matchType;
	}
	const nodes = useNodes();
	const edges = useEdges();
	// $: {
	// 	updateNodeData(id, { text: $nodeData?.data?.text?.toUpperCase() || '' });
	// }

	let hideTeams = false;
	$: playable = match.teams.filter((t) => t.id == -1).length == 0;
	$: focused = $focusedNode == match.id;
	let winnerID = -1;

	function handleContextMenuAction(action: string, teamId: number) {
		console.log(`Action: ${action}, Team ID: ${teamId}`);
		if (action.toLowerCase() === 'focus') {
			$focusedNode = match.id;
			$triggerFocusNodeAnimation = true;
		}
		if (action.toLowerCase() === 'remove') {
			match.teams.map((t) => {
				if (t.id == teamId) {
					t.id = -1;
					t.name = '-';
				}
				return t;
			})
		}

		if (action.toLowerCase() === 'setwinner') {
			if (winnerID == teamId) {
				winnerID = -1;
				
				let nextNodeID = match.winnerGoesTo.toString();
				let nextNode= $nodes.find((n) => n.id == nextNodeID);
				if (!nextNodeID || !nextNode) {
					console.error('node not found');
					return;
				}
				console.log(`nextNodeID= ${nextNodeID}`);
				console.log(`nextNode= ${JSON.stringify(nextNode)}`);

				let nextMatch = nextNode.data.match as matchType;
				let newTeams = nextMatch.teams.map((t)=>{
					if (t.id == teamId) {
						return {id:-1,name:'-'};
					}
					return t;
				})
				
				console.log(`newTeams=${JSON.stringify(newTeams)}`)
				updateNodeData(nextNodeID, {match: {...nextMatch,teams:newTeams}});

			} else {
				winnerID = teamId;
				let otherTeamID = match.teams.filter((t) => t.id != teamId)[0].id;
				let winnerTeam = match.teams.find((t) => t.id == winnerID);
				if (!winnerTeam) {
					console.error('winner team not found');
					return;
				}
				let nextNodeID = match.winnerGoesTo.toString();
				let nextNode= $nodes.find((n) => n.id == nextNodeID);
				if (!nextNodeID || !nextNode) {
					console.error('node not found');
					return;
				}
				console.log(`nextNodeID= ${nextNodeID}`);
				console.log(`nextNode= ${JSON.stringify(nextNode)}`);

				let nextMatch = nextNode.data.match as matchType;
				let i = nextMatch.teams.findIndex((t) => (t.id == otherTeamID));
				if (i ==-1){
					i = nextMatch.teams.findIndex((t) => (t.id == -1));
					
				}
				if (i == -1) {
					console.log(nextMatch.teams);
					console.log('object not found');
					return;
				}
				let newTeams= [{ id: winnerTeam.id, name: winnerTeam.name },... nextMatch.teams.filter((t,x) => (x!=i  ))];
				newTeams.sort((a, b) => a.id - b.id);
				console.log(`newTeams=${JSON.stringify(newTeams)}`)
				updateNodeData(nextNodeID, {match: {...nextMatch,teams:newTeams}});
			}
		}
	}
</script>

<div class="absolute left-[-1rem] top-1/2 -translate-y-1/2 ">
	{match.id}
</div>
<div class={'overflow-hidden text-xs' + (focused ? ' border border-green-500' : '')}>
	{#each match.teams as team, index}
		<ContextMenu>
			<ContextMenuTrigger>
				<TeamComponent
					id={team.id}
					name={team.name}
					{index}
					mode={winnerID == -1 ? 'default' : winnerID == team.id ? 'winner' : 'loser'}
				/>
			</ContextMenuTrigger>
			<ContextMenuContent>
				<ContextMenuItem
					disabled={!playable}
					on:click={() => handleContextMenuAction('setwinner', team.id)}
				>
					{`${winnerID === team.id ? 'Unset' : 'Set'} [${team.id}] As Winner`}
				</ContextMenuItem>
				<ContextMenuItem on:click={() => handleContextMenuAction('Focus', team.id)}>
					Focus
				</ContextMenuItem>
				<ContextMenuSeparator></ContextMenuSeparator>
				<ContextMenuItem on:click={() => handleContextMenuAction('Remove', team.id)}>
					Remove Team
				</ContextMenuItem>
				<ContextMenuSeparator></ContextMenuSeparator>
				<ContextMenuItem on:click={() => handleContextMenuAction('show-hide', team.id)}>
					{hideTeams ? 'show' : 'hide'} Team
				</ContextMenuItem>
			</ContextMenuContent>
		</ContextMenu>
	{/each}
</div>
<Handle type="source" position={Position.Right}></Handle>
<Handle type="target" position={Position.Left}></Handle>
