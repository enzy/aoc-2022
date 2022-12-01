import run from "aocrunner";

const parseInput = (rawElves: string) =>
  rawElves
    .split("\n\n")
    .map((elf) => elf.split("\n"))
    .map((elf) => elf.reduce((acc, line) => acc + parseInt(line), 0))
    .sort((a, b) => b - a);

const part1 = (rawInput: string) => {
  const elves = parseInput(rawInput);

  return elves[0];
};

const part2 = (rawInput: string) => {
  const elves = parseInput(rawInput);

  return elves[0] + elves[1] + elves[2];
};

run({
  part1: {
    tests: [
      {
        input: `1000
2000
3000

4000

5000
6000

7000
8000
9000

10000`,
        expected: 24000,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `1000
2000
3000

4000

5000
6000

7000
8000
9000

10000`,
        expected: 45000,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
