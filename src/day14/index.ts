import run from "aocrunner";

const EMPTY = undefined;
const INFINITY = 10000;

type x = number;
type y = number;
type Position = [x, y];
type RockPath = Position[];

interface Map {
  data: MapData;
  size: MapSize;
}

interface MapSize {
  width: number;
  height: number;
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
}

type MapData = string[][];

const parseInput = (rawInput: string) =>
  rawInput
    .split("\n")
    .map<RockPath>((line) =>
      line
        .split(" -> ")
        .map<Position>((pos) => pos.split(",").map(Number) as Position),
    );

function printMap(map: Map) {
  const { data } = map;
  data.forEach((line, y) => {
    line.forEach((char, x) => {
      process.stdout.write(char ?? ".");
    });
    process.stdout.write("\n");
  });
  process.stdout.write("\n");
}

function findMapSize(paths: RockPath[]): MapSize {
  const [xMin, xMax, yMin, yMax] = paths.flat().reduce(
    (acc, curr) => {
      const [x, y] = curr;
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
      0, // set minY to 0
      Number.MIN_SAFE_INTEGER,
    ],
  );
  const width = xMax - xMin + 1;
  const height = yMax - yMin + 1;

  return { width, height, xMin, xMax, yMin, yMax };
}

// Create a map and draw the rock paths on it
function createMap(paths: RockPath[], mapSize: MapSize): Map {
  const { width, height } = mapSize;
  const data = Array.from({ length: height }, () => Array(width).fill(EMPTY));
  const map = { data, size: mapSize };

  paths.forEach((positions) => {
    positions.forEach((curr, index) => {
      const [x0, y0] = positions[index - 1] ?? curr; // previous or the first
      const [x1, y1] = curr; // next
      const dx = x1 - x0;
      const dy = y1 - y0;
      const length = Math.abs(dx) + Math.abs(dy); // length of the line
      // draw rock path
      for (let i = 0; i < length; i++) {
        const x = x0 + (dx * i) / length; // follow the line on x
        const y = y0 + (dy * i) / length; // follow the line on y
        drawAt(map, [x, y], "#");
      }
      // draw last position
      drawAt(map, curr, "#");
    });
  });

  return map;
}

function drawAt(map: Map, position: Position, char: string) {
  const { data, size } = map;
  const [x, y] = position;
  data[y - size.yMin][x - size.xMin] = char;
}

function getAt(map: Map, position: Position): string {
  const { data, size } = map;
  const [x, y] = position;
  return data[y - size.yMin][x - size.xMin];
}

function sandParticleNextPosition(map: Map, pos: Position): Position | null {
  const { size } = map;
  const [x, y] = pos;
  // Abys
  if (y + 1 > size.yMax) {
    return null;
  }
  // Down
  const down = [x, y + 1] as Position;
  if (getAt(map, down) === EMPTY) {
    return down;
  }
  // Down and left
  const downLeft = [x - 1, y + 1] as Position;
  if (getAt(map, downLeft) === EMPTY) {
    return downLeft;
  }
  // Down and right
  const downRight = [x + 1, y + 1] as Position;
  if (getAt(map, downRight) === EMPTY) {
    return downRight;
  }

  return pos;
}

// Using your scan, simulate the falling sand.
// How many units of sand come to rest before sand starts flowing into the abyss below?
const part1 = (rawInput: string) => {
  const paths = parseInput(rawInput);

  const mapSize = findMapSize(paths);
  const map = createMap(paths, mapSize);

  const sandSpawnPosition: Position = [500, 0];
  drawAt(map, sandSpawnPosition, "+");

  //printMap(map);

  let next = [...sandSpawnPosition] as Position;
  while (next !== null) {
    const old = next;
    next = sandParticleNextPosition(map, next);
    // Came to rest
    if (old === next) {
      drawAt(map, next, "o");
      next = [...sandSpawnPosition];
    }
  }

  //printMap(map);

  return map.data.flat().filter((char) => char === "o").length;
};

const part2 = (rawInput: string) => {
  const paths = parseInput(rawInput);

  const mapSize = findMapSize(paths);
  // add the "infinite" floor on mapSize.yMax + 2
  mapSize.xMin = INFINITY * -1;
  mapSize.xMax = INFINITY;
  mapSize.width = mapSize.xMax - mapSize.xMin + 1;
  mapSize.yMax += 2;
  mapSize.height += 2;
  paths.push([
    [mapSize.xMin, mapSize.yMax],
    [mapSize.xMax, mapSize.yMax],
  ]);

  const map = createMap(paths, mapSize);

  const sandSpawnPosition: Position = [500, 0];
  drawAt(map, sandSpawnPosition, "+");

  //printMap(map);

  const maxIterations = Number.MAX_SAFE_INTEGER;
  let i = 0;
  let next = [...sandSpawnPosition] as Position;
  while (next !== null && i++ < maxIterations) {
    const old = next;
    next = sandParticleNextPosition(map, next);
    if (
      next &&
      next[0] === sandSpawnPosition[0] &&
      next[1] === sandSpawnPosition[1]
    ) {
      drawAt(map, next, "o");
      break;
    }
    // Came to rest
    if (old === next) {
      drawAt(map, next, "o");
      next = [...sandSpawnPosition];
    }
  }

  //printMap(map);

  return map.data.flat().filter((char) => char === "o").length;
};

const testInput = `498,4 -> 498,6 -> 496,6
503,4 -> 502,4 -> 502,9 -> 494,9
`;

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 24,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testInput,
        expected: 93,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
