import run from "aocrunner";
import { d, manhattan } from "../utils/heuristics.js";
import { clamp, mergeIntervals } from "../utils/index.js";

interface Position {
  x: number;
  y: number;
}

// track max covered distance
let maxCoverage = 0;

const parseInput = (rawInput: string) =>
  rawInput.split("\n").map((line) =>
    line.split(":").map<Position>((str) => {
      const [, x] = str.match(/x=(\-?\d+)/);
      const [, y] = str.match(/y=(\-?\d+)/);
      return { x: parseInt(x), y: parseInt(y) };
    }),
  );

function getMinMax(pairs: Position[][]) {
  const [xMin, xMax, yMin, yMax] = pairs.flat().reduce(
    (acc, curr) => {
      const { x, y } = curr;
      return [
        Math.min(acc[0], x),
        Math.max(acc[1], x),
        Math.min(acc[2], y),
        Math.max(acc[3], y),
      ];
    },
    [
      Number.MAX_SAFE_INTEGER,
      Number.MIN_SAFE_INTEGER,
      Number.MAX_SAFE_INTEGER,
      Number.MIN_SAFE_INTEGER,
    ],
  );

  const width = xMax - xMin + 1;
  const height = yMax - yMin + 1;

  return { width, height, xMin, xMax, yMin, yMax };
}

function getSignalsCoverage(
  signals: Position[][],
): Array<[Position, Position, number]> {
  return signals.map<[Position, Position, number]>(([sensor, beacon]) => {
    const dx = d(sensor.x, beacon.x);
    const dy = d(sensor.y, beacon.y);
    const coverage = manhattan(dx, dy);
    maxCoverage = Math.max(maxCoverage, coverage);
    return [sensor, beacon, coverage];
  });
}

// Consult the report from the sensors you just deployed.
// In the row where y=2000000, how many positions cannot contain a beacon?
const part1 = (rawInput: string) => {
  const signals = parseInput(rawInput);

  const { width, height, xMin, xMax, yMin, yMax } = getMinMax(signals);

  const signalsWithCoverage = getSignalsCoverage(signals);

  // compute a row
  // const y = 10; targetY
  const y = 2000000;
  const row = Array(width + maxCoverage * 2).fill(0);
  const from = xMin - maxCoverage;
  const to = xMax + maxCoverage;
  console.log({ from, to });
  for (let x = from; x <= to; x++) {
    signalsWithCoverage.forEach(([sensor, beacon, coveredDistance]) => {
      const dx = d(sensor.x, x);
      const dy = d(sensor.y, y);
      const sensorToPositionDistance = manhattan(dx, dy);
      // The position is in the range of the sensor
      if (sensorToPositionDistance <= coveredDistance) {
        row[x - from] = 1;
      }
      // The position can be a beacon or a sensor
      if (
        (sensor.x === x && sensor.y === y) ||
        (beacon.x === x && beacon.y === y)
      ) {
        row[x - from] = 0; // does not count
      }
    });
  }

  const covered = row.reduce((acc, curr) => acc + curr, 0);

  return covered;
};

const part2 = (rawInput: string) => {
  const signals = parseInput(rawInput);
  const { width, height, xMin, xMax, yMin, yMax } = getMinMax(signals);
  const signalsWithCoverage = getSignalsCoverage(signals);

  // The distress beacon must have x and y coordinates each no lower than 0 and no larger than 4000000.
  const maxCoordinates = 4000000; //20; // 4000000
  const from = 0;
  const to = maxCoordinates;
  console.log({ width, height, from, to });

  // y: [fromX, toX][] - capped by maxCoordinates
  const intervalsByY = new Map<number, any>();
  signalsWithCoverage.forEach(([sensor, , coverage]) => {
    const origX = sensor.x;
    const origY = sensor.y;
    // Map coverage to intervals of searched positions
    Array(coverage * 2 + 1)
      .fill(0)
      .forEach((_, i) => {
        const y = origY - coverage + i;
        const dy = d(origY, y);
        const width = coverage - dy;

        if (y < 0 || y > maxCoordinates) {
          return null;
        }

        if (!intervalsByY.has(y)) {
          intervalsByY.set(y, []);
        }
        intervalsByY
          .get(y)
          .push([
            clamp(origX - width, from, to),
            clamp(origX + width, from, to),
          ]);
      });
  });

  // Join the intervals and find a gap => the missing beacon
  for (let y = from; y <= to; y++) {
    const intervals = intervalsByY.get(y);
    const mergedIntervals = mergeIntervals(intervals);
    // Two intervals means there is a gap
    if (mergedIntervals.length > 1) {
      const x = mergedIntervals[0][1] + 1;
      const frequency = x * 4000000 + y;

      console.log({ y, x });
      console.log("GOT THE RESULT!!!", frequency);
      return frequency;
    }
  }
};

run({
  part1: {
    tests: [
      // {
      //   input: `Sensor at x=2, y=18: closest beacon is at x=-2, y=15
      // Sensor at x=9, y=16: closest beacon is at x=10, y=16
      // Sensor at x=13, y=2: closest beacon is at x=15, y=3
      // Sensor at x=12, y=14: closest beacon is at x=10, y=16
      // Sensor at x=10, y=20: closest beacon is at x=10, y=16
      // Sensor at x=14, y=17: closest beacon is at x=10, y=16
      // Sensor at x=8, y=7: closest beacon is at x=2, y=10
      // Sensor at x=2, y=0: closest beacon is at x=2, y=10
      // Sensor at x=0, y=11: closest beacon is at x=2, y=10
      // Sensor at x=20, y=14: closest beacon is at x=25, y=17
      // Sensor at x=17, y=20: closest beacon is at x=21, y=22
      // Sensor at x=16, y=7: closest beacon is at x=15, y=3
      // Sensor at x=14, y=3: closest beacon is at x=15, y=3
      // Sensor at x=20, y=1: closest beacon is at x=15, y=3
      // `,
      //   expected: 56000011,
      // },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      // {
      //   input: ``,
      //   expected: "",
      // },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
