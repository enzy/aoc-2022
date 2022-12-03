import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput.split("\n");

/*
    Lowercase item types a through z have priorities 1 through 26.
    Uppercase item types A through Z have priorities 27 through 52.
 */
function getPriorityForLetter(letter: string) {
  const charCode = letter.charCodeAt(0);

  if (charCode <= 90) {
    return charCode - 65 + 27;
  }

  return letter.charCodeAt(0) - 96;
}

function splitCompartmentsIntoTwo(compartments: string[]) {
  const half = compartments.length / 2;

  return [
    compartments.slice(0, half).join(""),
    compartments.slice(half).join(""),
  ];
}

function findMatchingItems(c1: string, c2: string) {
  const items = c1.split("").filter((char) => c2.includes(char));
  return items;
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const sum = input.reduce((acc, line) => {
    const [first, second] = splitCompartmentsIntoTwo(line.split(""));
    const matchingItems = findMatchingItems(first, second);
    return acc + getPriorityForLetter(matchingItems[0]);
  }, 0);

  return sum;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  let totalSum = 0;

  // common between all three Elves
  const chunkSize = 3;
  for (let i = 0; i < input.length; i += chunkSize) {
    const chunk = input.slice(i, i + chunkSize);

    const matchingFirstTwo = findMatchingItems(chunk[0], chunk[1]);
    const matchingAll = findMatchingItems(matchingFirstTwo.join(""), chunk[2]);

    totalSum += getPriorityForLetter(matchingAll[0]);
  }

  return totalSum;
};

run({
  part1: {
    tests: [
      {
        input: `vJrwpWtwJgWrhcsFMMfFFhFp
jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
PmmdzqPrVvPwwTWBwg
wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
ttgJtRGJQctTZtZT
CrZsJsPPZsGzwwsLwLmpwMDw
`,
        expected: 157,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `vJrwpWtwJgWrhcsFMMfFFhFp
jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
PmmdzqPrVvPwwTWBwg
wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
ttgJtRGJQctTZtZT
CrZsJsPPZsGzwwsLwLmpwMDw
`,
        expected: 70,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
