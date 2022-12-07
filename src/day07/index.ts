import run from "aocrunner";
import { resolve } from "path";

const parseInput = (rawInput: string) => rawInput.split("\n");

type PathObject = { path: string };

function storeCommand(
  fileTree,
  currentPath: PathObject,
  currentCommand: string,
  line: string,
) {
  // Dir into directory
  if (currentCommand.startsWith("cd")) {
    const newPath = line.slice(5);
    currentPath.path = resolve(currentPath.path, newPath);
  }
  // List directory
  if (currentCommand.startsWith("ls")) {
  }
}

function storeCommandOutput(
  fileTree,
  currentPath: PathObject,
  currentCommand: string,
  line: string,
) {
  if (currentCommand.startsWith("ls")) {
    // either a file or a directory
    if (line.startsWith("dir")) {
      const dirName = line.slice(4);
      const dirPath = resolve(currentPath.path, dirName);
      fileTree[dirPath] = 0;
    } else {
      const [fileSize, fileName] = line.split(" ");
      const currentSize = fileTree[currentPath.path] ?? 0;
      fileTree[currentPath.path] = currentSize + Number(fileSize);
    }
  }
}

function getTotalSizeOfDirectory(fileTree, dirPath) {
  let size = fileTree[dirPath];
  const subDirs = Object.keys(fileTree).filter(
    (dir) => dir.startsWith(dirPath) && dir !== dirPath,
  );

  // filter out subDirs which are not direct children of dirPath (because it's not a TREE structure)
  const directSubdirs = subDirs.filter((dir) => {
    const subDirParts = dir.split("/").filter(Boolean);
    const dirPathParts = dirPath.split("/").filter(Boolean);
    return subDirParts.length === dirPathParts.length + 1;
  });

  directSubdirs.forEach((subDir) => {
    size += getTotalSizeOfDirectory(fileTree, subDir);
  });
  return size;
}

function buildFileSizeTree(lines) {
  const fileTree = { "/": 0 };
  const currentPath = { path: "/" };
  let currentCommand = "ls";

  lines.forEach((line) => {
    if (line[0] === "$") {
      currentCommand = line.slice(2);
      storeCommand(fileTree, currentPath, currentCommand, line);
      return;
    }
    storeCommandOutput(fileTree, currentPath, currentCommand, line);
  });

  return fileTree;
}

function convertFileSizeTreeToTotalSize(fileTree) {
  let newFileTree = {};
  for (const key in fileTree) {
    newFileTree[key] = getTotalSizeOfDirectory(fileTree, key);
  }
  return newFileTree;
}

// Size at most 100000
// What is the sum of the total sizes of those directories?
const part1 = (rawInput: string) => {
  const lines = parseInput(rawInput);
  const fileTree = buildFileSizeTree(lines);
  const totalSizeTree = convertFileSizeTreeToTotalSize(fileTree);

  let totalSizeOfMatchingDirectories = 0;

  for (const key in totalSizeTree) {
    const totalSize = totalSizeTree[key];
    if (totalSize < 100000) {
      totalSizeOfMatchingDirectories += totalSize;
    }
  }

  return totalSizeOfMatchingDirectories;
};

// Find the smallest directory that, if deleted, would free up enough space on the filesystem to run the update.
// What is the total size of that directory?
const part2 = (rawInput: string) => {
  const lines = parseInput(rawInput);
  const fileTree = buildFileSizeTree(lines);
  const totalSizeTree = convertFileSizeTreeToTotalSize(fileTree);
  const totalSizeTreeEntries = (Object.values(totalSizeTree) as number[]).sort(
    (a, b) => a - b,
  );

  const diskSize = 70000000;
  const rootDirSize = totalSizeTreeEntries[totalSizeTreeEntries.length - 1];
  const freeSpace = diskSize - rootDirSize;
  const neededSpace = 30000000 - freeSpace;

  const dir = totalSizeTreeEntries.filter((size) => size >= neededSpace);

  return dir[0];
};

run({
  part1: {
    tests: [
      {
        input: `$ cd /
$ ls
dir a
14848514 b.txt
8504156 c.dat
dir d
$ cd a
$ ls
dir e
29116 f
2557 g
62596 h.lst
$ cd e
$ ls
584 i
$ cd ..
$ cd ..
$ cd d
$ ls
4060174 j
8033020 d.log
5626152 d.ext
7214296 k
`,
        expected: 95437,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `$ cd /
$ ls
dir a
14848514 b.txt
8504156 c.dat
dir d
$ cd a
$ ls
dir e
29116 f
2557 g
62596 h.lst
$ cd e
$ ls
584 i
$ cd ..
$ cd ..
$ cd d
$ ls
4060174 j
8033020 d.log
5626152 d.ext
7214296 k
`,
        expected: 24933642,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
