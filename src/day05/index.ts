import run from "aocrunner";

const parseInput = (rawInput: string): [string[][], string[]] => {
  const [crates, moves] = rawInput
    .split("\n\n")
    .map((lines) => lines.split("\n"));

  crates.reverse();
  const craneCount = (crates[0].length + 1) / 4;
  const stacks = Array.from({ length: craneCount }, () => []);

  // put crates on stacks, filter out first line with labels
  crates.slice(1).forEach((row, rowIndex) => {
    stacks.forEach((stack, stackIndex) => {
      const crate = row[stackIndex * 4 + 1];
      if (crate !== " ") stack.push(crate);
    });
  });

  return [stacks, moves];
};

function parseMove(move: string) {
  const [, count, , from, , to] = move.split(" ");

  return [Number(count), Number(from), Number(to)];
}

// move create one by one
function moveCrate(move: string, stacks: string[][]) {
  const [count, from, to] = parseMove(move);

  if (!count) return;

  const fromStack = stacks[from - 1];
  const toStack = stacks[to - 1];

  for (let i = 0; i < count; i++) {
    toStack.push(fromStack.pop());
  }
}

// the ability to pick up and move multiple crates at once
// stay in the same order
function moveCrateAtOnce(move: string, stacks: string[][]) {
  const [count, from, to] = parseMove(move);

  if (!count) return;

  const fromStack = stacks[from - 1];
  const toStack = stacks[to - 1];

  const crates = fromStack.splice(fromStack.length - count, count);
  toStack.push(...crates);
}

// After the rearrangement procedure completes, what crate ends up on top of each stack?
const part1 = (rawInput: string) => {
  const [stacks, moves] = parseInput(rawInput);

  moves.forEach((move) => {
    moveCrate(move, stacks);
  });

  // Return the labels of the crates on top of each stack
  return stacks.reduce((acc, stack) => acc + stack.pop(), "");
};

// After the rearrangement procedure completes, what crate ends up on top of each stack?
const part2 = (rawInput: string) => {
  const [stacks, moves] = parseInput(rawInput);

  moves.forEach((move) => {
    moveCrateAtOnce(move, stacks);
  });

  // Return the labels of the crates on top of each stack
  return stacks.reduce((acc, stack) => acc + stack.pop(), "");
};

run({
  part1: {
    tests: [
      {
        input: `    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2
`,
        expected: "CMZ",
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2
`,
        expected: "MCD",
      },
    ],
    solution: part2,
  },
  trimTestInputs: false,
  onlyTests: false,
});
