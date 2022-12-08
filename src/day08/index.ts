import run from "aocrunner";

const parseInput = (rawInput: string) =>
  rawInput.split("\n").map((line) => line.split("").map(Number));

// Consider your map; how many trees are visible from outside the grid?
const part1 = (rawInput: string) => {
  const map = parseInput(rawInput);
  const rows = map.length;
  const cols = map[0].length;

  let visibleTrees = 0;

  // A tree is visible if all of the other trees between it and an edge of the grid are shorter than it.
  // Only consider trees in the same row or column; that is, only look up, down, left, or right from any given tree.
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const tree = map[y][x];
      // look up - y-1, y >= 0
      let visibleUp = true;
      for (let i = y - 1; i >= 0; i--) {
        if (map[i][x] >= tree) {
          visibleUp = false;
          break;
        }
      }
      // look down - y+1, y < rows
      let visibleDown = true;
      for (let i = y + 1; i < rows; i++) {
        if (map[i][x] >= tree) {
          visibleDown = false;
          break;
        }
      }
      // look left - x-1, x >= 0
      let visibleLeft = true;
      for (let i = x - 1; i >= 0; i--) {
        if (map[y][i] >= tree) {
          visibleLeft = false;
          break;
        }
      }
      // look right - x+1, x < cols
      let visibleRight = true;
      for (let i = x + 1; i < cols; i++) {
        if (map[y][i] >= tree) {
          visibleRight = false;
          break;
        }
      }
      if (visibleUp || visibleDown || visibleLeft || visibleRight) {
        visibleTrees++;
      }
    }
  }

  return visibleTrees;
};

// What is the highest scenic score possible for any tree?
const part2 = (rawInput: string) => {
  const map = parseInput(rawInput);
  const rows = map.length;
  const cols = map[0].length;

  let highestScenicScore = 0;

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const tree = map[y][x];
      // look up - y-1, y >= 0
      let scoreUp = 0;
      for (let i = y - 1; i >= 0; i--) {
        scoreUp++;
        if (map[i][x] >= tree) {
          break;
        }
      }
      // look down - y+1, y < rows
      let scoreDown = 0;
      for (let i = y + 1; i < rows; i++) {
        scoreDown++;
        if (map[i][x] >= tree) {
          break;
        }
      }
      // look left - x-1, x >= 0
      let scoreLeft = 0;
      for (let i = x - 1; i >= 0; i--) {
        scoreLeft++;
        if (map[y][i] >= tree) {
          break;
        }
      }
      // look right - x+1, x < cols
      let scoreRight = 0;
      for (let i = x + 1; i < cols; i++) {
        scoreRight++;
        if (map[y][i] >= tree) {
          break;
        }
      }

      const totalTreeScore = scoreUp * scoreDown * scoreLeft * scoreRight;
      if (totalTreeScore > highestScenicScore) {
        highestScenicScore = totalTreeScore;
      }
    }
  }

  return highestScenicScore;
};

run({
  part1: {
    tests: [
      {
        input: `30373
25512
65332
33549
35390`,
        expected: 21,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `30373
25512
65332
33549
35390
`,
        expected: 8,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
