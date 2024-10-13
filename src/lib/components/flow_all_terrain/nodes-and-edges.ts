import { Position, type Node, type Edge } from '@xyflow/svelte';
import { quadInOut } from 'svelte/easing';
import { XoffsetStore, YoffsetStore, nodeHeightStore } from './stores';
import { get } from 'svelte/store';
function closestLowerPowerOfTwo(n: number) {
	if (n <= 0) {
		return 0; // 2^0 = 1 is the closest power of 2 for non-positive numbers
	}

	const lowerPower = Math.floor(Math.log2(n)); // Get the largest power of 2 less than or equal to n
	return Math.pow(2, lowerPower);
}

type Team = { id: number; name: string; club?: string };
type Match = {
	id: number;
	teams: Team[];
	winnerGoesTo: number;
	roundNumber: number;
	index: number;
	XoffsetModifer: number;
	YoffsetModifer: number;
	initialSpots?: number;
};
type Round = Match[];
export type Tournament = Round[];
const empty_teams: Team[] = [
	{ id: -1, name: '-' },
	{ id: -1, name: '-' },
	{ id: -1, name: '-' },
	{ id: -1, name: '-' }
];

export function createNodeFromMatch(match: Match): Node {
	let {
		id: matchID,
		teams,
		winnerGoesTo,
		roundNumber,
		index,
		XoffsetModifer,
		YoffsetModifer
	} = match;
	const Xoffset = get(XoffsetStore);
	const nodeHeight = get(nodeHeightStore);
	const Yoffset = get(YoffsetStore);
	const p = Math.pow(4, roundNumber + YoffsetModifer - 1);
	let Yoff = (nodeHeight + Yoffset) * p * (index - 1) + ((nodeHeight + Yoffset) * (p - 1)) / 2;
	let Xoff = Xoffset * (roundNumber + XoffsetModifer);

	let node: Node = {
		id: matchID.toString(),
		data: {
			match: {
				id: matchID,
				teams: teams,
				winnerGoesTo: winnerGoesTo,
				winnerID: -1
			}
		},
		position: { x: Xoff, y: Yoff },
		type: 'match',
		class: 'svelte-flow__node-default p-0',
		sourcePosition: Position.Right,
		targetPosition: Position.Left,
		width: 200,
		draggable: false,
		connectable: false
	};

	return node;
}
function createEdgeFromMatch(match: Match): Edge {
	let { id: matchID, winnerGoesTo: matchWinnerGoesTo } = match;
	let edge: Edge = {
		id: `edge-${matchID}-${matchWinnerGoesTo}`,
		source: matchID.toString(),
		target: matchWinnerGoesTo.toString(),
		type: 'step',
		style: 'stroke-width: 3px;'
	};
	return edge;
}
function generateRound(
	start: number,
	roundNumber: number,
	n: number,
	XoffsetModifer = 0,
	YoffsetModifer = 0
): Round {
	let res: Round = [];
	for (let i = 1; i <= n; i++) {
		const matchID = i + start;
		const winnerGoesTo = Math.ceil(i / 4) + start + n + 1;
		let match: Match = {
			id: matchID,
			teams: empty_teams,
			winnerGoesTo: winnerGoesTo,
			roundNumber: roundNumber,
			index: i,
			XoffsetModifer: XoffsetModifer,
			YoffsetModifer: YoffsetModifer
			// node: createNodeFromMatch(
			// 	matchID,
			// 	empty_teams,
			// 	roundNumber,
			// 	i,
			// 	XoffsetModifer,
			// 	YoffsetModifer
			// ),
			// edge: createEdgeFromMatch(matchID, winnerGoesTo)
		};

		res.push(match);
	}
	return res;
}

export function generateTournament(numberOfTeams: number, start_initial: number = 0): Tournament {
	let n = closestLowerPowerOfTwo(numberOfTeams);
	let k = Math.log2(n);
	let q = numberOfTeams - n; // number of matches in eliminatory round
	// numberOfTeams = 128;
	let totalNumberOfMatches = numberOfTeams - 1;
	let numberOfRounds = k;
	let tournament: Tournament = [];
	let start = start_initial;
	let round_i = 1;
	if (numberOfTeams >= 128) {
		tournament.push(generateRound(start, round_i, 32));
		round_i++;
	}
	start = 33;
	if (numberOfTeams >= 32) {
		tournament.push(generateRound(start, round_i, 8));
		round_i++;
	}
	start = 42;
	if (numberOfTeams >= 8) {
		tournament.push(generateRound(start, round_i, 2));
		round_i++;
	}
	start = 45;

	tournament.push(generateRound(start, round_i, 1, 0, -1));

	return tournament;
}
export function updateTournamentTeams(tournament: Tournament, teamNames: string[]): Tournament {
	let x_id = 0;
	console.log("teamnames ",teamNames)
	const round = tournament[0];
	for (let j = 0; j < round.length; j++) {
		const match = round[j];
		
			match.teams = [
				{ id: x_id + 1, name: teamNames[x_id] },
				{ id: x_id + 2, name: teamNames[x_id + 1] },
				{ id: x_id + 3, name: teamNames[x_id + 2] },
				{ id: x_id + 4, name: teamNames[x_id + 3] }
			];
			x_id += 4;
	}
	return tournament;
}
export function getNodesAndEdgesFromTournament(tournament: Tournament): [Node[], Edge[]] {
	const Nodes: Node[] = [];
	const Edges: Edge[] = [];
	for (let i = 0; i < tournament.length; i++) {
		const round = tournament[i];
		for (let j = 0; j < round.length; j++) {
			const match = round[j];
			Nodes.push(createNodeFromMatch(match));
			Edges.push(createEdgeFromMatch(match));
		}
	}
	return [Nodes, Edges];
}
