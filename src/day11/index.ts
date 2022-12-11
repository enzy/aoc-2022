import run from "aocrunner";
import { lcm } from "mathjs";

const parseInput = (rawInput: string) => rawInput.split("\n\n");
type Index = number;

interface Monkey {
  // lists your worry level for each item the monkey is currently holding in the order they will be inspected.
  items: number[];
  // shows how your worry level changes as that monkey inspects an item.
  inspect: (oldWorryLevel: number) => number;
  inspected: number;
  // shows how the monkey uses your worry level to decide where to throw an item next.
  divisibleBy: number;
  test: (worryLevel: number) => Index;
}

function operation(operationTemplate: string[], oldWorryLevel: number): number {
  const [, operator, bStr] = operationTemplate;
  // first is always old
  const a = Number(oldWorryLevel);
  const b = Number(bStr === "old" ? oldWorryLevel : bStr);

  switch (operator) {
    case "+":
      return a + b;
    case "-":
      return a - b;
    case "*":
      return a * b;
    case "/":
      return a / b;
    case "%":
      return a % b;
  }
}

const parseMonkey = (monkey: string): Monkey => {
  const lines = monkey.split("\n");
  const items = lines[1]
    .split(":")[1]
    .trim()
    .split(",")
    .map((item) => {
      return Number(item.trim());
    });
  const operationTemplate = lines[2].split("=")[1].trim().split(" ");
  const divisibleBy = Number(lines[3].split(":")[1].match(/(\d+)/)[0]);
  const ifTrue = Number(lines[4].match(/(\d+)/)[0]);
  const ifFalse = Number(lines[5].match(/(\d+)/)[0]);

  return {
    items,
    divisibleBy,
    inspect: (old) => {
      return operation(operationTemplate, old);
    },
    test: (level) => {
      return level % divisibleBy === 0 ? ifTrue : ifFalse;
    },
    inspected: 0,
  };
};

/**
 * @param monkeys - array of monkeys
 * @param reduceStress - if true, reduce stress 3 times each round, otherwise limit the value by LCM (modulo)
 * @param lcm - Least Common Multiple of all monkeys
 */
function round(monkeys: Monkey[], reduceStress: boolean, lcm = 1) {
  monkeys.forEach((monkey, monkeyIndex) => {
    monkey.items = monkey.items
      .map((item) => {
        monkey.inspected++;
        return monkey.inspect(item);
      })
      .map((item) => {
        return reduceStress ? Math.floor(item / 3) : item % lcm;
      })
      .filter((item, index) => {
        const target = monkey.test(item);
        if (target === monkeyIndex) {
          return true;
        }
        monkeys[target].items.push(item);
        return false;
      });
  });
}

function printMonkeys(monkeys: Monkey[]) {
  monkeys.forEach((monkey) => console.log(monkey.items, monkey.inspected));
}

function monkeyBusiness(monkeys: Monkey[]) {
  const mostActive = monkeys.sort((a, b) => b.inspected - a.inspected);
  return mostActive[0].inspected * mostActive[1].inspected;
}

// What is the level of monkey business after 20 rounds of stuff-slinging simian shenanigans?
const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const monkeys = input.map((monkey) => parseMonkey(monkey));

  const rounds = 20;
  for (let i = 0; i < rounds; i++) {
    round(monkeys, true);
  }
  // return the monkey business
  return monkeyBusiness(monkeys);
};

// What is the level of monkey business after 10000 rounds?
const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const monkeys = input.map((monkey) => parseMonkey(monkey));

  // @ts-ignore - wrong types,
  const monkeysLcm = lcm(...monkeys.map((monkey) => monkey.divisibleBy));

  const rounds = 10000;
  for (let i = 0; i < rounds; i++) {
    round(monkeys, false, monkeysLcm);
  }
  // return the monkey business
  return monkeyBusiness(monkeys);
};

const testInput = `Monkey 0:
  Starting items: 79, 98
  Operation: new = old * 19
  Test: divisible by 23
    If true: throw to monkey 2
    If false: throw to monkey 3

Monkey 1:
  Starting items: 54, 65, 75, 74
  Operation: new = old + 6
  Test: divisible by 19
    If true: throw to monkey 2
    If false: throw to monkey 0

Monkey 2:
  Starting items: 79, 60, 97
  Operation: new = old * old
  Test: divisible by 13
    If true: throw to monkey 1
    If false: throw to monkey 3

Monkey 3:
  Starting items: 74
  Operation: new = old + 3
  Test: divisible by 17
    If true: throw to monkey 0
    If false: throw to monkey 1
`;

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 10605,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testInput,
        expected: 2713310158,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
