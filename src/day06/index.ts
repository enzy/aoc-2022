import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput;

function checkForMarker(input: string, position: number, length = 4) {
  for (let i = position, buffer = []; i > position - length && i >= 0; i--) {
    const char = input[i];
    if (buffer.includes(char)) return false;
    buffer.push(char);
  }
  return true;
}

// How many characters need to be processed before the first start-of-packet marker is detected?
// four characters that are all different.
const part1 = (rawInput: string) => {
  const lines = parseInput(rawInput);

  for (let i = 3; i < lines.length; i++) {
    if (checkForMarker(lines, i)) return i + 1;
  }
};

// How many characters need to be processed before the first start-of-message marker is detected?
// 14 distinct characters
const part2 = (rawInput: string) => {
  const lines = parseInput(rawInput);

  for (let i = 13; i < lines.length; i++) {
    if (checkForMarker(lines, i, 14)) return i + 1;
  }
};

run({
  part1: {
    tests: [
      { input: `mjqjpqmgbljsphdztnvjfqwrcgsmlb`, expected: 7 },
      { input: `bvwbjplbgvbhsrlpgdmjqwftvncz`, expected: 5 },
      { input: `nppdvjthqldpwncqszvftbrmjlhg`, expected: 6 },
      { input: `nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg`, expected: 10 },
      { input: `zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw`, expected: 11 },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      { input: `mjqjpqmgbljsphdztnvjfqwrcgsmlb`, expected: 19 },
      { input: `bvwbjplbgvbhsrlpgdmjqwftvncz`, expected: 23 },
      { input: `nppdvjthqldpwncqszvftbrmjlhg`, expected: 23 },
      { input: `nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg`, expected: 29 },
      { input: `zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw`, expected: 26 },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
