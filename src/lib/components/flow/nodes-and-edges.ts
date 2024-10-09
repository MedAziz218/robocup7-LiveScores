import { Position, type Node, type Edge } from '@xyflow/svelte';
export const initialNodes: Node[] = [];
export const initialEdges: Edge[] = [];


function closestPowerOfTwo(n: number) {
	if (n <= 0) {
		return 0; // 2^0 = 1 is the closest power of 2 for non-positive numbers
	}

	const lowerPower = Math.floor(Math.log2(n)); // Get the largest power of 2 less than or equal to n
	const upperPower = lowerPower + 1; // The next power of 2

	const lowerValue = Math.pow(2, lowerPower); // Calculate 2^lowerPower
	const upperValue = Math.pow(2, upperPower); // Calculate 2^upperPower

	// Compare which is closer to n
	const lowerDiff = Math.abs(n - lowerValue);
	const upperDiff = Math.abs(n - upperValue);

	return lowerDiff < upperDiff ? lowerValue : upperValue; // Return the closest power of 2
}

type Match = { id: number; winnerGoesTo: number };
type Round = Match[];
type Tournament = Round[];
const empty_teams = [{id:-1,name:'-'},{id:-1,name:'-'}]
const Xoffset = 200;
const nodeHeight = 50;
const Yoffset = 10;

function createNodeFromMatch(match: Match, roundNumber: number,index:number,start:number): Node {
    const off = (roundNumber-1==0)? (nodeHeight+Yoffset)/2 : 0
    const off2 = (roundNumber-2==0)? (nodeHeight+Yoffset) :0;
    const off3 = (roundNumber-3==0)? (nodeHeight+Yoffset)*1.5 :0;

    let node:Node = {
     	id: match.id.toString(),
     	data: {
     		match: {
     			id: match.id,
     			teams: empty_teams ,
     		},
     	},
     	position: { x: Xoffset*roundNumber, y: ((nodeHeight+Yoffset)*roundNumber*(index) ) },
     	type: 'match',
     	class: 'svelte-flow__node-default p-0',
     	sourcePosition: Position.Right,
     	targetPosition: Position.Left,
     };
     return node;
}
function generateRound(start: number, roundNumber: number, k: number): Round {
	let res: Round = [];
	for (let i = 1; i <= Math.pow(2, k - roundNumber); i++) {
		let match: Match = {
			id: i + start,
			winnerGoesTo: Math.ceil(i / 2) + start + Math.pow(2, k - roundNumber)
		};

		res.push(match);
    initialNodes.push(createNodeFromMatch(match, roundNumber,i,start))
	}
	return res;
}
function generateTournament(numberOfTeams: number): Tournament {
	let n = closestPowerOfTwo(numberOfTeams);
	let k = Math.log2(n);
	let q = numberOfTeams - n; // number of matches in eliminatory round
	let totalNumberOfMatches = numberOfTeams - 1;
	let numberOfRounds = k;
	let res: Tournament = [];
	let start = 0;
	for (let i = 1; i <= k; i++) {
		res.push(generateRound(start, i, k));
		start += Math.pow(2, k - i);
	}

	return res;
}
console.log(generateTournament(16));

