import { readFile } from "fs/promises";

const rawTest = `RL

AAA = (BBB, CCC)
BBB = (DDD, EEE)
CCC = (ZZZ, GGG)
DDD = (DDD, DDD)
EEE = (EEE, EEE)
GGG = (GGG, GGG)
ZZZ = (ZZZ, ZZZ)`;

const inputFilePath = new URL("./input.txt", import.meta.url);
const rawInput = await readFile(inputFilePath, { encoding: "utf-8" });
const input = rawInput.trim().split("\n");
const test = rawTest.trim().split("\n");

const processInput = (contents: string[]) => {
  const [directions, _, ...routeMap] = contents;
  routeMap.forEach((line) => {
    const left = line.slice(7, 10);
    const right = line.slice(12, 15);
    Map.collection[line.slice(0, 3)] = new Map(left, right);
  });
  return directions;
};

const problem1 = (contents: string[]) => {
};

const problem2 = (contents: string[]) => {
  return undefined;
};

export const results = {
  part1: problem1(input),
  part2: problem2(input),
};

export const testResults = {
  part1: problem1(test),
  part2: problem2(test),
};
