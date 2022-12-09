import run from "aocrunner";

interface Position {
  x: number;
  y: number;
}

type Move = "U" | "D" | "L" | "R";

const parseInput = (rawInput: string) =>
  rawInput.split("\n").map((line) => line.split(" "));

function movePointerPosition(move, count, pointer: Position) {
  switch (move as Move) {
    case "U":
      pointer.y -= Number(count);
      break;
    case "D":
      pointer.y += Number(count);
      break;
    case "L":
      pointer.x -= Number(count);
      break;
    case "R":
      pointer.x += Number(count);
      break;
  }
}

function getGridSize(moves) {
  let minX = Number.MAX_SAFE_INTEGER;
  let maxX = Number.MIN_SAFE_INTEGER;
  let minY = Number.MAX_SAFE_INTEGER;
  let maxY = Number.MIN_SAFE_INTEGER;

  const measureTape: Position = { x: 0, y: 0 };

  moves.forEach(([move, count]) => {
    movePointerPosition(move, count, measureTape);
    minX = Math.min(minX, measureTape.x);
    maxX = Math.max(maxX, measureTape.x);
    minY = Math.min(minY, measureTape.y);
    maxY = Math.max(maxY, measureTape.y);
  });

  const sizeX = maxX - minX + 1;
  const sizeY = maxY - minY + 1;

  return { sizeX, sizeY, minY, maxY, minX, maxX };
}

function createGrid(moves) {
  const { sizeX, sizeY, minY, minX } = getGridSize(moves);

  const visualGrid: string[][] = new Array(sizeY)
    .fill(".")
    .map(() => new Array(sizeX).fill("."));
  const shadowGrid: number[][] = new Array(sizeY)
    .fill(0)
    .map(() => new Array(sizeX).fill(0));

  const startPosition: Position = { x: 0 - minX, y: 0 - minY };

  return {
    visualGrid,
    shadowGrid,
    startPosition,
  };
}

function printGrid(grid) {
  console.log(grid.map((row) => row.join("")).join("\n"));
}

function trackHeadWithTail(head: Position, tail: Position) {
  // If the head is over two steps directly up, down, left, or right from the tail, the tail must also move one step in that direction so it remains close enough
  if (head.x === tail.x || head.y === tail.y) {
    if (Math.abs(head.x - tail.x) >= 2) {
      tail.x += head.x > tail.x ? 1 : -1;
    }
    if (Math.abs(head.y - tail.y) >= 2) {
      tail.y += head.y > tail.y ? 1 : -1;
    }
  } else {
    // Otherwise, if the head and tail aren't touching and aren't in the same row or column, the tail always moves one step diagonally to keep up
    const distance = Math.abs(head.x - tail.x) + Math.abs(head.y - tail.y);
    if (distance > 2) {
      tail.x += head.x > tail.x ? 1 : -1;
      tail.y += head.y > tail.y ? 1 : -1;
    }
  }
}

// Simulate your complete hypothetical series of motions.
// How many positions does the tail of the rope visit at least once?
const part1 = (rawInput: string) => {
  const moves = parseInput(rawInput);
  const DEBUG = false;

  const { visualGrid, shadowGrid, startPosition } = createGrid(moves);

  const head: Position = { ...startPosition };
  const tail: Position = { ...startPosition };

  // Mark start position
  visualGrid[head.y][head.x] = "s";
  shadowGrid[head.y][head.x] = 1;

  moves.forEach(([move, count]) => {
    // Move one step a time
    for (let i = 0; i < Number(count); i++) {
      // clear the visualGrid
      visualGrid[head.y][head.x] = ".";
      visualGrid[tail.y][tail.x] = ".";
      // Move pointer
      movePointerPosition(move, 1, head);
      visualGrid[head.y][head.x] = "H";
      // Track the head with tail
      trackHeadWithTail(head, tail);
      visualGrid[tail.y][tail.x] = "T";
      // Mark tail position
      shadowGrid[tail.y][tail.x] = 1;
      // Debug
      if (DEBUG) {
        printGrid(visualGrid);
        console.log("\n");
      }
    }
  });

  return shadowGrid.reduce(
    (acc, row) => acc + row.reduce((acc, cell) => acc + cell, 0),
    0,
  );
};

// Simulate your complete series of motions on a larger rope with ten knots.
// How many positions does the tail of the rope visit at least once?
const part2 = (rawInput: string) => {
  const moves = parseInput(rawInput);

  const { shadowGrid, startPosition } = createGrid(moves);

  const head: Position = { ...startPosition };
  const tails: Position[] = [
    { ...startPosition },
    { ...startPosition },
    { ...startPosition },
    { ...startPosition },
    { ...startPosition },
    { ...startPosition },
    { ...startPosition },
    { ...startPosition },
    { ...startPosition },
  ];
  // tail[8] is the watched tail

  // Mark start position
  shadowGrid[head.y][head.x] = 1;

  moves.forEach(([move, count]) => {
    // Move one step a time
    for (let i = 0; i < Number(count); i++) {
      // Move pointer
      movePointerPosition(move, 1, head);
      // Track the head with tails
      tails.forEach((tail, index) => {
        const trackingHead = index === 0 ? head : tails[index - 1];
        trackHeadWithTail(trackingHead, tail);

        // Mark watched tail position
        if (index === 8) {
          shadowGrid[tail.y][tail.x] = 1;
        }
      });
    }
  });

  return shadowGrid.reduce(
    (acc, row) => acc + row.reduce((acc, cell) => acc + cell, 0),
    0,
  );
};

run({
  part1: {
    tests: [
      {
        input: `R 4
U 4
L 3
D 1
R 4
D 1
L 5
R 2
`,
        expected: 13,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `R 5
U 8
L 8
D 3
R 17
D 10
L 25
U 20
`,
        expected: 36,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
