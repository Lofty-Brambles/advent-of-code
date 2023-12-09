import { readFile } from "fs/promises";

const rawTest = `two1nine
eightwothree
abcone2threexyz
xtwone3four
4nineeightseven2
zoneight234
7pqrstsixteen`;

const inputFilePath = new URL("./input.txt", import.meta.url);
const rawInput = await readFile(inputFilePath, { encoding: "utf-8" });
const input = rawInput.trim().split("\n");
const test = rawTest.trim().split("\n");

const findNumber = (element: string) => {
  const allDigits = Array.from({ length: 10 }, (_, index) => index);
  const confirmDigit = (value: string) => allDigits.includes(+value);

  const leftNumber = element.split("").find(confirmDigit);
  const rightNumber = element.split("").findLast(confirmDigit);
  return +`${leftNumber}${rightNumber}`;
};

const problem1 = (contents: string[]) => {
  return contents.reduce((previous, now) => previous + findNumber(now), 0);
};

const replaceWordsWithNumbers = (element: string) => {
  // prettier-ignore
  const words = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine" ];
  words.forEach((word: string, indexOfWord: number) => {
    element = element.replaceAll(word, `${word}${indexOfWord}${word}`);
  });

  return element;
};

const problem2 = (contents: string[]) => {
  const findAndReplace = (line: string) =>
    findNumber(replaceWordsWithNumbers(line));

  return contents.reduce((previous, now) => previous + findAndReplace(now), 0);
};

export const results = {
  part1: problem1(input),
  part2: problem2(input),
};

export const testResults = {
  part1: problem1(test),
  part2: problem2(test),
};
