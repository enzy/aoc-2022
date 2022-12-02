import run from "aocrunner";

const parseInput = (rawInput: string) =>
  rawInput.split("\n").map((line) => line.split(" "));

// Rock > Scissors, Scissors > Paper, and Paper > Rock

type choice = "R" | "P" | "S";
type strategy = "X" | "Y" | "Z";

// A for Rock, B for Paper, and C for Scissors
// Part 1: X for Rock, Y for Paper, and Z for Scissors
function mapEncryptedChoiceToRealOne(choice: string): choice {
  switch (choice) {
    case "A":
    case "X":
      return "R";
    case "B":
    case "Y":
      return "P";
    case "C":
    case "Z":
      return "S";
  }
}

function getRockPaperScissorsWinner(a: choice, b: choice) {
  if (a === b) return 0;
  if (a === "R" && b === "S") return 1;
  if (a === "S" && b === "P") return 1;
  if (a === "P" && b === "R") return 1;
  return 2;
}

// shape you selected (1 for Rock, 2 for Paper, and 3 for Scissors)
function getScoreForChoice(choice: choice) {
  switch (choice) {
    case "R":
      return 1;
    case "P":
      return 2;
    case "S":
      return 3;
  }
}

// outcome of the round (0 if you lost, 3 if the round was a draw, and 6 if you won).
function getScoreForRound(a: choice, b: choice) {
  const winner = getRockPaperScissorsWinner(a, b);
  if (winner === 0) return 3;
  if (winner === 1) return 6;
  return 0;
}

function getYourScore(a: choice, roundScore: number) {
  return getScoreForChoice(a) + roundScore;
}

// Part 2
function mapStrategyToChoice(strategy: strategy, opponent: choice): choice {
  // Loose
  if (strategy === "X") {
    switch (opponent) {
      case "R":
        return "S";
      case "P":
        return "R";
      case "S":
        return "P";
    }
  }
  // Draw
  if (strategy === "Y") {
    return opponent;
  }
  // Win
  if (strategy === "Z") {
    switch (opponent) {
      case "R":
        return "P";
      case "P":
        return "S";
      case "S":
        return "R";
    }
  }
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const total = input.reduce((acc, [a, b]) => {
    const you = mapEncryptedChoiceToRealOne(b);
    const opponent = mapEncryptedChoiceToRealOne(a);
    const roundScore = getScoreForRound(you, opponent);
    const yourScore = getYourScore(you, roundScore);
    return acc + yourScore;
  }, 0);

  return total;
};

// "Anyway, the second column says how the round needs to end:
// X means you need to lose,
// Y means you need to end the round in a draw,
// and Z means you need to win. Good luck!"
const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const total = input.reduce((acc, [a, b]) => {
    const opponent = mapEncryptedChoiceToRealOne(a);
    const you = mapStrategyToChoice(b as strategy, opponent);
    const roundScore = getScoreForRound(you, opponent);
    const yourScore = getYourScore(you, roundScore);
    return acc + yourScore;
  }, 0);

  return total;
};

run({
  part1: {
    tests: [
      {
        input: `A Y
B X
C Z
`,
        expected: 15,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `A Y
B X
C Z
`,
        expected: 12,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
