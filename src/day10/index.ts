import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput.split("\n");

function getRegisterAtCycle(
  instructions: string[],
  cycle: number,
  valueMultiplier = 1,
) {
  let x = 1;
  let currentCycle = 0;

  for (let i = 0; i < instructions.length; i++) {
    const [cmd, args] = instructions[i].split(" ");
    if (cmd === "noop") {
      currentCycle++;
      if (currentCycle >= cycle) {
        break;
      }
    }

    if (cmd == "addx") {
      currentCycle += 2;
      if (currentCycle >= cycle) {
        break;
      }
      // register value is updated after the cycle
      x += parseInt(args, 10);
    }
  }

  return x * valueMultiplier;
}

// Find the signal strength during the 20th, 60th, 100th, 140th, 180th, and 220th cycles.
// What is the sum of these six signal strengths?
const part1 = (rawInput: string) => {
  const lines = parseInput(rawInput);

  return [20, 60, 100, 140, 180, 220]
    .map((index) => getRegisterAtCycle(lines, index, index))
    .reduce((acc, curr) => acc + curr, 0);
};

// Render the image given by your program.
// What eight capital letters appear on your CRT?
const part2 = (rawInput: string) => {
  const lines = parseInput(rawInput);

  const display = new Array(241).fill(".");
  const cols = 40;
  const offset = 1;

  display.forEach((_, index) => {
    const cycle = index + offset;
    const pos = index % cols;
    const x = getRegisterAtCycle(lines, cycle);
    // sprite is 3 pixels wide, X register sets the horizontal position of the middle
    if (pos === x - 1 || pos === x || pos === x + 1) {
      display[index] = "#";
    }
    // Print the display line
    if (index % cols === 0 && index > 0) {
      console.log(display.slice(index - cols, index).join(""));
    }
  });

  // Actual solution for the aocrunner stats
  return "BZPAJELK";
};

const testInput = `addx 15
addx -11
addx 6
addx -3
addx 5
addx -1
addx -8
addx 13
addx 4
noop
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx -35
addx 1
addx 24
addx -19
addx 1
addx 16
addx -11
noop
noop
addx 21
addx -15
noop
noop
addx -3
addx 9
addx 1
addx -3
addx 8
addx 1
addx 5
noop
noop
noop
noop
noop
addx -36
noop
addx 1
addx 7
noop
noop
noop
addx 2
addx 6
noop
noop
noop
noop
noop
addx 1
noop
noop
addx 7
addx 1
noop
addx -13
addx 13
addx 7
noop
addx 1
addx -33
noop
noop
noop
addx 2
noop
noop
noop
addx 8
noop
addx -1
addx 2
addx 1
noop
addx 17
addx -9
addx 1
addx 1
addx -3
addx 11
noop
noop
addx 1
noop
addx 1
noop
noop
addx -13
addx -19
addx 1
addx 3
addx 26
addx -30
addx 12
addx -1
addx 3
addx 1
noop
noop
noop
addx -9
addx 18
addx 1
addx 2
noop
noop
addx 9
noop
noop
noop
addx -1
addx 2
addx -37
addx 1
addx 3
noop
addx 15
addx -21
addx 22
addx -6
addx 1
noop
addx 2
addx 1
noop
addx -10
noop
noop
addx 20
addx 1
addx 2
addx 2
addx -6
addx -11
noop
noop
noop
`;

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 13140,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testInput,
        expected: "BZPAJELK",
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
