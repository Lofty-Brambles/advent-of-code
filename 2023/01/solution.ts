import { readFile } from "fs/promises";

const rawTest = ``;

const inputFilePath = new URL("./input.txt", import.meta.url);
const rawInput = await readFile(inputFilePath, { encoding: "utf-8" });
const input = rawInput.trim().split("\n");
const test = rawTest.trim().split("\n");

const problem1 = (contents: string[]) => {
  const findNumber = (element: string) => {
    const allDigits = Array.from({ length: 10 }, (_, index) => index);
    const confirmDigit = (value: string) => allDigits.includes(+value);
    const leftNumber = element.split("").find(confirmDigit);
    const rightNumber = element.split("").findLast(confirmDigit);
    return +`${leftNumber}${rightNumber}`;
  };

  return contents.reduce((previous, now) => previous + findNumber(now), 0);
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
