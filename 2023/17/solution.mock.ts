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
type Direction = "up" | "down" | "left" | "right";
type Node = { block: Block; from: Direction; heat: number; step: number };

const DIRECTIONS = { up: [-1, 0], down: [1, 0], left: [0, -1], right: [0, 1] };
const REVERSE = { up: "down", down: "up", left: "right", right: "left" };

const traversal = (graph: number[][], min: number, max: number) => {
  const visited = new Set<string>();
  const hash = (block: Block, from: Direction, step: number) =>
    `${block}-${from}-${step}`;

  const heap = [{ block: [0, 0], from: "right", heat: 0, step: 0 }] as Node[];
  const addToHeap = (node: Node) => {
    const index = heap.findIndex((value) => value.heat > node.heat);
    index === -1 ? heap.push(node) : heap.splice(index, 0, node);
  };

  const heats = new Map<string, number>();
  const target: Block = [graph.length - 1, graph[0].length - 1];
  const equals = (block1: Block, block2: Block) =>
    block1[0] === block2[0] && block1[1] === block2[1];
  const addBlocks = (block1: Block, block2: number[]) =>
    [0, 1].map((id) => block1[id] + block2[id]) as Block;

  while (true) {
    const { block, from, heat, step } = heap.pop()!;
    console.log({ block, from, heat, step });
    if (equals(block, target) && step >= min) return heat;

    const key = hash(block, from, step);
    if (visited.has(key)) continue;

    for (const [direction, shift] of Object.entries(DIRECTIONS)) {
      if (REVERSE[from] === direction) continue;
      if (from === direction && step === max) continue;
      if (step && from !== direction && step < min) continue;

      const nextBlock = addBlocks(block, shift);
      const nextNodeHeat = graph[nextBlock[0]]?.[nextBlock[1]];
      if (nextNodeHeat === undefined) continue;

      const nextStep = from === direction ? step + 1 : 1;
      const nextHash = hash(block, direction as Direction, nextStep);
      if (visited.has(nextHash)) continue;

      const nextHeat = heat + nextNodeHeat;
      const existingHeat = heats.get(nextHash);
      if (!(!existingHeat || existingHeat > nextHeat)) continue;
      heats.set(nextHash, nextHeat);

      const details = { block: nextBlock, from: direction as Direction };
      addToHeap({ ...details, heat: nextHeat, step: nextStep });
    }

    visited.add(key);
  }
};

const problem1 = (contents: string[]) => {
  const graph = contents.map((line) => line.split("").map(Number));
  return traversal(graph, 1, 3);
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
