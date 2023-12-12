import { readFile } from "fs/promises";

const rawTest = `0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45`;

const inputFilePath = new URL("./input.txt", import.meta.url);
const rawInput = await readFile(inputFilePath, { encoding: "utf-8" });
const input = rawInput.trim().split("\n");
const test = rawTest.trim().split("\n");

type Mapping = (initial: number[], next: number[]) => number;
const predict = (numbers: number[], mapping: Mapping) => {
  if (numbers.every((number) => number === 0)) return 0;

  const nextNumbers = Array.from(
    { length: numbers.length - 1 },
    (_, index) => numbers[index + 1] - numbers[index]
  );

  return mapping(numbers, nextNumbers);
};

const problem1 = (contents: string[]) => {
  const mapping = (numbers: number[], nextNumbers: number[]) =>
    numbers.at(-1)! + predict(nextNumbers, mapping);

  return contents
    .map((line) => line.split(" ").map(Number))
    .reduce((sum, number) => sum + predict(number, mapping), 0);
};

const problem2 = (contents: string[]) => {
  const mapping = (numbers: number[], nextNumbers: number[]) =>
    numbers.at(0)! - predict(nextNumbers, mapping);

  return contents
    .map((line) => line.split(" ").map(Number))
    .reduce((sum, number) => sum + predict(number, mapping), 0);
};

export const results = {
  part1: problem1(input),
  part2: problem2(input),
};

export const testResults = {
  part1: problem1(test),
  part2: problem2(test),
};
