import run from "aocrunner";
import { isNumber } from "../utils/index.js";

const parseInput = (rawInput: string) =>
  rawInput
    .split("\n\n")
    .map((pairs) => pairs.split("\n").map((pair) => JSON.parse(pair)));

type ListOrNumber = number | any[];

function compare(left: ListOrNumber, right: ListOrNumber, indent = ""): number {
  const leftIsNumber = isNumber(left);
  const rightIsNumber = isNumber(right);

  // both values are integer
  if (leftIsNumber && rightIsNumber) {
    return left === right ? 0 : left < right ? -1 : 1;
  }
  // exactly one value is integer
  if (leftIsNumber) {
    return compare([left], right, indent + "\t");
  }
  // exactly one value is integer
  if (rightIsNumber) {
    return compare(left, [right], indent + "\t");
  }
  // both values are lists
  const length = Math.min(left.length, right.length);
  for (let i = 0; i < length; i++) {
    const result = compare(left[i], right[i], indent + "\t");
    if (result !== 0) return result;
  }
  // else compare lengths
  return left.length - right.length;
}

// Determine which pairs of packets are already in the right order.
// What is the sum of the indices of those pairs?
const part1 = (rawInput: string) => {
  const pairs = parseInput(rawInput);

  // How many pairs of packets are in the right order.
  const inRightOrder = pairs
    .map(([left, right], index) => {
      const pair = index + 1;
      if (compare(left, right, "") < 0) {
        return pair;
      }
      return 0;
    })
    .filter(Boolean);

  return inRightOrder.reduce((acc, curr) => acc + curr, 0);
};

// Organize all of the packets into the correct order.
// What is the decoder key for the distress signal?
const part2 = (rawInput: string) => {
  const pairs = parseInput(rawInput);

  // Decoder keys for the distress signal.
  const dk1 = [[2]];
  const dk2 = [[6]];

  // Sort packets in the correct order.
  const packets = [...pairs.flat(), dk1, dk2];
  packets.sort(compare);

  // Determine the indices of the two divider packets and multiply them together.
  let decoderKey = 1;
  packets.forEach((packet, index) => {
    if (packet === dk1 || packet === dk2) {
      decoderKey *= index + 1;
    }
  });

  return decoderKey;
};

const testData = `
[1,1,3,1,1]
[1,1,5,1,1]

[[1],[2,3,4]]
[[1],4]

[9]
[[8,7,6]]

[[4,4],4,4]
[[4,4],4,4,4]

[7,7,7,7]
[7,7,7]

[]
[3]

[[[]]]
[[]]

[1,[2,[3,[4,[5,6,7]]]],8,9]
[1,[2,[3,[4,[5,6,0]]]],8,9]
`;

run({
  part1: {
    tests: [
      {
        input: testData,
        expected: 13,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testData,
        expected: 140,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
