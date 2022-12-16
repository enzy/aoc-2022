import run from "aocrunner";
import { euclidean } from "../utils/heuristics.js";

type x = number;
type y = number;
type Position = [x, y];
type ElevationMap = number[][];

interface Node {
  x: number;
  y: number;
  g: number; // Cost from start to this node
  h: number; // Heuristic cost to the end node
  f: number; // Total cost (g+h)
  parent?: Node; // Path
}
type NodeMap = Node[][];

const parseInput = (rawInput: string): ElevationMap =>
  rawInput.split("\n").map((line) => line.split("").map(mapElevation));

// 1 - 26
function mapElevation(input: string) {
  const code = input.charCodeAt(0);

  // "a" is 97, "z" is 122
  if (code >= 97 && code <= 122) {
    return code - 97 + 1;
  }
  // S
  if (code == 83) {
    return 1;
  }
  // E
  if (code === 69) {
    return 26;
  }
  // Here be dragons
  return 0;
}

// Start is marked as "S"
function findStart(input: string): Position {
  const map = input.split("\n");
  const start = map.find((line) => line.includes("S"));
  return [start.indexOf("S"), map.indexOf(start)];
}

// End is  marked as "E
function findEnd(input: string): Position {
  const map = input.split("\n");
  const end = map.find((line) => line.includes("E"));
  return [end.indexOf("E"), map.indexOf(end)];
}

// Distance heuristic
function distance(from: Position, to: Position) {
  const dx = Math.abs(from[0] - to[0]);
  const dy = Math.abs(from[1] - to[1]);
  return euclidean(dx, dy);
}

// For given position, what are the next available positions?
function nextAvailablePositions(
  map: ElevationMap,
  current: Position,
  elevationDifference = 1,
): Position[] {
  const [x, y] = current;
  const width = map[0].length;
  const height = map.length;
  const elevation = map[y][x];
  const directions: Position[] = [
    [x - 1, y], // left
    [x + 1, y], // right
    [x, y - 1], // up
    [x, y + 1], // down
  ];

  return directions.filter((pos) => {
    const [x, y] = pos;
    const exists = x >= 0 && x < width && y >= 0 && y < height;
    if (!exists || map[y][x] === 0) {
      return false;
    }
    const dist = map[y][x];
    const lowerOrTheSame = dist <= elevation;
    const higher = dist === elevation + elevationDifference;

    return lowerOrTheSame || higher;
  });
}

function getNode(pos: Position, nodeMap: NodeMap): Node {
  const [x, y] = pos;
  return nodeMap[y][x];
}

function updateNode(node: Node, end: Node): void {
  node.g = gCost(node);
  node.h = distance([node.x, node.y], [end.x, end.y]);
  node.f = node.g + node.h;
}

function gCost(node: Node): number {
  let cost = 1;
  let current = node;
  while (current.parent) {
    cost += 1;
    current = current.parent;
  }
  return cost;
}

function getNodePath(node: Node): Position[] {
  const path: Position[] = [];
  let current = node;
  while (current.parent) {
    path.push([current.x, current.y]);
    current = current.parent;
  }
  return path.reverse();
}

// ASC
function compareF(a: Node, b: Node) {
  return a.f - b.f;
}

/**
 * Find the shortest path between the start and the end position on the map
 * - uses A* algorithm
 */
function findPath(
  map: ElevationMap,
  start: Position,
  end: Position,
): Position[] | null {
  const nodeMap: NodeMap = map.map((row, y) =>
    row.map((_, x) => ({ x, y, g: 0, h: 0, f: 0 })),
  );
  const width = map[0].length;
  const height = map.length;
  const maxIterations = width * height;

  const endNode = getNode(end, nodeMap);
  const openList: Node[] = [];
  const closedList: Node[] = [];

  // Add the starting node to the open list
  openList.push(getNode(start, nodeMap));

  let iteration = 0;
  // Repeat the following
  while (openList.length > 0) {
    // Failsafe if the algorithm takes too long
    if (iteration++ > maxIterations) {
      console.error("Too many iterations");
      break;
    }
    // Look for the lowest F cost node on the open list.
    openList.sort(compareF);
    const current = openList.shift();

    // Switch it to the closed list
    closedList.push(current);

    // If it is the destination node, return the path
    if (current.x === endNode.x && current.y === endNode.y) {
      return getNodePath(current);
    }

    // For each available adjacent nodes to this current node
    const adjacentPositions = nextAvailablePositions(map, [
      current.x,
      current.y,
    ]);
    adjacentPositions.forEach(([x, y]) => {
      const node = getNode([x, y], nodeMap);
      if (closedList.includes(node)) {
        return;
      }
      // If it isn’t on the open list, add it to the open list.
      if (!openList.includes(node)) {
        openList.push(node);
        // Make the current node the parent of this node.
        node.parent = current;
        // Record the F, G, and H costs of the node.
        updateNode(node, endNode);
      } else {
        // If it is on the open list already, check if this path to that node is better
        if (node.g < current.g) {
          node.parent = current;
          updateNode(node, endNode);
        }
      }
      // Resort the open list by F cost.
      openList.sort(compareF);
    });
  }
  // No path was found
  return null;
}

// What is the fewest steps required to move from your current position to the location that should get the best signal?
const part1 = (rawInput: string) => {
  const map = parseInput(rawInput);
  const start = findStart(rawInput);
  const end = findEnd(rawInput);

  const path = findPath(map, start, end);

  if (path) {
    return path.length;
  }
};

// What is the fewest steps required to move starting from any square with elevation a to the location that should get the best signal?
const part2 = (rawInput: string) => {
  const map = parseInput(rawInput);
  const end = findEnd(rawInput);

  const possiblePaths = [];

  map.forEach((row, y) => {
    row.forEach((elevation, x) => {
      if (elevation === 1) {
        const path = findPath(map, [x, y], end);
        if (path) {
          possiblePaths.push(path.length);
        }
      }
    });
  });

  return possiblePaths.sort((a, b) => a - b)[0];
};

const testInput = `Sabqponm
abcryxxl
accszExk
acctuvwj
abdefghi
`;

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 31,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testInput,
        expected: 29,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
