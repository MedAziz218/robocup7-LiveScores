import { Position, type Node, type Edge } from '@xyflow/svelte';
import { quadInOut } from 'svelte/easing';

function closestLowerPowerOfTwo(n: number) {
	if (n <= 0) {
		return 0; // 2^0 = 1 is the closest power of 2 for non-positive numbers
	}

	const lowerPower = Math.floor(Math.log2(n)); // Get the largest power of 2 less than or equal to n
	return Math.pow(2, lowerPower);
	// const upperPower = lowerPower + 1; // The next power of 2

	// const lowerValue = Math.pow(2, lowerPower); // Calculate 2^lowerPower
	// const upperValue = Math.pow(2, upperPower); // Calculate 2^upperPower

	// // Compare which is closer to n
	// const lowerDiff = Math.abs(n - lowerValue);
	// const upperDiff = Math.abs(n - upperValue);

	// return lowerDiff < upperDiff ? lowerValue : upperValue; // Return the closest power of 2
}

type Team = { id: number; name: string; club?: string };
type Match = { id: number; winnerGoesTo: number; node: Node; edge: Edge };
type Round = Match[];
export type Tournament = Round[];
const empty_teams: Team[] = [
	{ id: -1, name: '-' },
	{ id: -1, name: '-' }
];
const Xoffset = 220;
const nodeHeight = 50;
const Yoffset = 10;

export function createNodeFromMatch(
	matchID: number,
	teams: Team[],
	roundNumber: number,
	index: number,
	XoffsetModifer = 0,
	YoffsetModifer = 0
): Node {
	const p = Math.pow(2, roundNumber + YoffsetModifer - 1);
	let Yoff = (nodeHeight + Yoffset) * p * (index - 1) + ((nodeHeight + Yoffset) * (p - 1)) / 2;
	let Xoff = Xoffset * (roundNumber + XoffsetModifer);
	let node: Node = {
		id: matchID.toString(),
		data: {
			match: {
				id: matchID,
				teams: empty_teams
			}
		},
		position: { x: Xoff, y: Yoff },
		type: 'match',
		class: 'svelte-flow__node-default p-0',
		sourcePosition: Position.Right,
		targetPosition: Position.Left,
		draggable: false,
		connectable: false
	};

	return node;
}
function createEdgeFromMatch(matchID: number, matchWinnerGoesTo: number): Edge {
	let edge: Edge = {
		id: `edge-${matchID}-${matchWinnerGoesTo}`,
		source: matchID.toString(),
		target: matchWinnerGoesTo.toString(),
		type: 'smoothstep'
	};
	return edge;
}
function generateRound(
	start: number,
	roundNumber: number,
	k: number,
	XoffsetModifer = 0,
	YoffsetModifer = 0
): Round {
	let res: Round = [];
	for (let i = 1; i <= Math.pow(2, k - roundNumber); i++) {
		const matchID = i + start;
		const winnerGoesTo = Math.ceil(i / 2) + start + Math.pow(2, k - roundNumber);
		let match: Match = {
			id: matchID,
			winnerGoesTo: winnerGoesTo,
			node: createNodeFromMatch(
				matchID,
				empty_teams,
				roundNumber,
				i,
				XoffsetModifer,
				YoffsetModifer
			),
			edge: createEdgeFromMatch(matchID, winnerGoesTo)
		};

		res.push(match);
	}
	return res;
}
function generateEliminationRoundCase1(
	start: number,
	roundNumber: number,
	k: number,
	q: number
): Round {
	let res: Round = [];
	for (let i = 1; i <= q; i++) {
		const matchID = i + start;
		const winnerGoesTo = Math.ceil(i) + start + q + (Math.pow(2, k - 1) - q);
		let match: Match = {
			id: matchID,
			winnerGoesTo: winnerGoesTo,
			node: createNodeFromMatch(matchID, empty_teams, roundNumber, i+(Math.pow(2, k - 1) - q), -1),
			edge: createEdgeFromMatch(matchID, winnerGoesTo)
		};

		res.push(match);
	}
	// for (let i = 1; i <= q; i++) {
	// 	const matchID = i + start;
	// 	const winnerGoesTo =  start + q + Math.pow(2, k - 1)-Math.ceil(i) +1;
	// 	let match: Match = {
	// 		id: matchID,
	// 		winnerGoesTo: winnerGoesTo,
	// 		node: createNodeFromMatch(matchID,empty_teams, roundNumber, Math.pow(2, k - 1)-Math.ceil(i) +1,-1),
	// 		edge: createEdgeFromMatch(matchID, winnerGoesTo)
	// 	};

	// 	res.push(match);
	// }
	return res;
}
function generateEliminationRoundCase2(
	start: number,
	roundNumber: number,
	k: number,
	q: number,
	x: number,
	XoffsetModifer = -1,
	YoffsetModifer = 0
): Round {
	let res: Round = [];
	for (let i = 1; i <= (q-x)*2; i++) {
		const matchID = i + start;
		const winnerGoesTo = Math.ceil(i / 2) + start + q;
		let match: Match = {
			id: matchID,
			winnerGoesTo: winnerGoesTo,
			node: createNodeFromMatch(
				matchID,
				empty_teams,
				roundNumber,
				i,
				XoffsetModifer,
				YoffsetModifer
			),
			edge: createEdgeFromMatch(matchID, winnerGoesTo)
		};

		res.push(match);
	}

	let b = (q-x)*2;
	for (let i = b+1; i <=q; i++) {
		const matchID = i + start;
		const winnerGoesTo = Math.ceil(i) + q - Math.floor(b/2);
		let match: Match = {
			id: matchID,
			winnerGoesTo: winnerGoesTo,
			node: createNodeFromMatch(
				matchID,
				empty_teams,
				roundNumber,
				i+(i-b),
				XoffsetModifer,
				YoffsetModifer
			),
			edge: createEdgeFromMatch(matchID, winnerGoesTo)
		};

		res.push(match);
	}
	
	return res;
	// let res: Round = [];
	// for (let i = 1; i <= x; i++) {
	// 	const matchID = i + start;
	// 	const winnerGoesTo =  start + q + Math.pow(2, k - 1)-Math.ceil(i/2)+1 ;
	// 	let match: Match = {
	// 		id: matchID,
	// 		winnerGoesTo: winnerGoesTo,
	// 		node: createNodeFromMatch(matchID,empty_teams, roundNumber, Math.pow(2, k)-Math.ceil(i) +1,-1),
	// 		edge: createEdgeFromMatch(matchID, winnerGoesTo)
	// 	};

	// 	res.push(match);
	// }
	// for (let i = x+1; i <= q; i++) {
	// 	const matchID = i + start;
	// 	const winnerGoesTo =  start + q + Math.pow(2, k - 1)-Math.ceil(i)+1 ;
	// 	let match: Match = {
	// 		id: matchID,
	// 		winnerGoesTo: winnerGoesTo,
	// 		node: createNodeFromMatch(matchID,empty_teams, roundNumber, Math.pow(2, k)-Math.ceil(i) +1,-1),
	// 		edge: createEdgeFromMatch(matchID, winnerGoesTo)
	// 	};

	// 	res.push(match);
	// }
	// return res;
}

export function generateTournament(numberOfTeams: number): Tournament {
	let n = closestLowerPowerOfTwo(numberOfTeams);
	let k = Math.log2(n);
	let q = numberOfTeams - n; // number of matches in eliminatory round
	let totalNumberOfMatches = numberOfTeams - 1;
	let numberOfRounds = k;
	let tournament: Tournament = [];
	let start = 0;
	let m = 0;
	if (q > 0) {
		if (q > Math.pow(2, k - 1)) {
			let x = Math.pow(2, k - 1);
			tournament.push(generateEliminationRoundCase2(start, 1, k, q, x));

			start += q;

			for (let i = 1; i <= k; i++) {
				tournament.push(generateRound(start, i, k, 0, 1));
				start += Math.pow(2, k - i);
			}
		}
		if (q <= Math.pow(2, k - 1)) {
			tournament.push(generateEliminationRoundCase1(start, 1, k, q));
			start += q;
			for (let i = 1; i <= k; i++) {
				tournament.push(generateRound(start, i, k));
				start += Math.pow(2, k - i);
			}
		}
	} else {
		for (let i = 1; i <= k; i++) {
			tournament.push(generateRound(start, i, k));
			start += Math.pow(2, k - i);
		}
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
			Nodes.push(match.node);
			Edges.push(match.edge);
		}
	}
	return [Nodes, Edges];
}
