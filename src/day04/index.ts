import run from "aocrunner";

const parseInput = (rawInput: string) =>
  rawInput
    .split("\n")
    .map((line) =>
      line.split(",").map((assigned) => assigned.split("-").map(Number)),
    );

function testFullyContains(first, second) {
  const [firstStart, firstEnd] = first;
  const [secondStart, secondEnd] = second;

  return firstStart <= secondStart && firstEnd >= secondEnd;
}

function testOverlap(first, second) {
  const [firstStart, firstEnd] = first;
  const [secondStart, secondEnd] = second;

  return (
    (firstStart <= secondStart && firstEnd >= secondStart) ||
    (secondStart <= firstStart && secondEnd >= firstStart)
  );
}

// In how many assignment pairs does one range fully contain the other?
const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  let fullyContained = 0;

  input.forEach(([first, second]) => {
    if (testFullyContains(first, second) || testFullyContains(second, first)) {
      fullyContained++;
    }
  });

  return fullyContained;
};

// In how many assignment pairs do the ranges overlap?
const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  let overlapping = 0;

  input.forEach(([first, second]) => {
    if (testOverlap(first, second) || testOverlap(second, first)) {
      overlapping++;
    }
  });

  return overlapping;
};

run({
  part1: {
    tests: [
      {
        input: `2-4,6-8
2-3,4-5
5-7,7-9
2-8,3-7
6-6,4-6
2-6,4-8
`,
        expected: 2,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `2-4,6-8
2-3,4-5
5-7,7-9
2-8,3-7
6-6,4-6
2-6,4-8
`,
        expected: 4,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
