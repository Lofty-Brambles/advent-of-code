import { readFile } from "fs/promises";

const rawTest = `Time:      7  15   30
Distance:  9  40  200`;

const inputFilePath = new URL("./input.txt", import.meta.url);
const rawInput = await readFile(inputFilePath, { encoding: "utf-8" });
const input = rawInput.trim().split("\n");
const test = rawTest.trim().split("\n");

const inBetweenRoots = (time: number, distance: number) => {
  const sqrt = Math.sqrt(time ** 2 - 4 * distance);
  return Math.ceil((time + sqrt) / 2) - Math.floor((time - sqrt) / 2) - 1;
};

const problem1 = (inputs: string[]) => {
  const [times, distances] = inputs.map((line) => line.split(/\s+/g).slice(1));
  return times.reduce((product, time, index) => {
    return product * inBetweenRoots(+time, +distances[index]);
  }, 1);
};

const problem2 = (inputs: string[]) => {
  const [time, distance] = inputs.map((line) =>
    line.split(":")[1].replaceAll(" ", "")
  );
  return inBetweenRoots(+time, +distance);
};

export const results = {
  part1: problem1(input),
  part2: problem2(input),
};

export const testResults = {
  part1: problem1(test),
  part2: problem2(test),
};
