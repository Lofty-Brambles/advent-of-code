import { readFile } from "fs/promises";

const rawTest = `2413432311323
3215453535623
3255245654254
3446585845452
4546657867536
1438598798454
4457876987766
3637877979653
4654967986887
4564679986453
1224686865563
2546548887735
4322674655533`;

const inputFilePath = new URL("./input.txt", import.meta.url);
const rawInput = await readFile(inputFilePath, { encoding: "utf-8" });
const input = rawInput.trim().split("\n");
const test = rawTest.trim().split("\n");

type Block = [number, number];
const addBlocks = (block1: Block, block2: Block) =>
  [0, 1].map((id) => block1[id] + block2[id]) as Block;
const multiplyby = (block: Block, number: number) =>
  [0, 1].map((id) => block[id] * number) as Block;
const equals = (block1: Block, block2: Block) =>
  block1[0] === block2[0] && block1[1] === block2[1];
const isValid =
  ([MAX_ROW, MAX_COLUMN]: Block) =>
  ([row, column]: Block) =>
    row >= 0 && row <= MAX_ROW && column >= 0 && column <= MAX_COLUMN;

const MOVEMENTS: Record<string, Block> = {
  up: [-1, 0],
  down: [1, 0],
  left: [0, -1],
  right: [0, 1],
};

const REVERSE: Record<string, Direction> = {
  up: "down",
  down: "up",
  left: "right",
  right: "left",
};

type Direction = "up" | "down" | "left" | "right" | "";
type Node = { block: Block; from: Direction; heat: number };
const dijkastra = (graph: number[][], minStep: number, maxStep: number) => {
  const checked = new Set<string>();
  const heats: Record<string, number> = {};
  const heap = [] as Node[];
  const addToHeap = (node: Node) => {
    const index = heap.findIndex((value) => value.heat > node.heat);
    index === -1 ? heap.push(node) : heap.splice(index, 0, node);
  };

  const target: Block = [graph.length - 1, graph[0].length - 1];
  const validity = isValid(target);

  const queueDistances = (current: Node, move: Block, from: string) => {
    let heat = 0;
    for (let distance = 1; distance <= maxStep; distance++) {
      const newBlock = addBlocks(current.block, multiplyby(move, distance));
      if (!validity(newBlock)) continue;

      heat += graph[newBlock[0]][newBlock[1]];
      if (distance < minStep) continue;

      const newHeat = current.heat + heat;
      const possible = { block: newBlock, from, heat: newHeat };
      if (heats[`${current.block}-${current.from}`] <= newHeat) continue;

      heats[`${current.block}-${current.from}`] = newHeat;
      addToHeap(possible as Node);
    }
  };

  const search = () => {
    addToHeap({ block: [0, 0], from: "", heat: 0 });
    while (true) {
      const current = heap.pop()!;
      if (equals(current.block, target)) return current.heat;
      if (checked.has(`${current.block}-${current.from}`)) continue;
      checked.add(`${current.block}-${current.from}`);

      for (const [from, move] of Object.entries(MOVEMENTS)) {
        if ([from, REVERSE[from]].includes(current.from)) continue;
        queueDistances(current, move, from);
      }
    }
  };

  return { search };
};

const problem1 = (contents: string[]) => {
  const graph = contents.map((line) => line.split("").map(Number));
  return dijkastra(graph, 1, 3).search();
};

const problem2 = (contents: string[]) => {
  return undefined;
};

// export const results = {
//   part1: problem1(input),
//   part2: problem2(input),
// };

export const testResults = {
  part1: problem1(test),
  part2: problem2(test),
};
