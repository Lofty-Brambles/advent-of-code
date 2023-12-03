import { readFile } from "fs/promises";

const inputFilePath = new URL("./input.txt", import.meta.url);
const rawInput = await readFile(inputFilePath, { encoding: "utf-8" });
const input = rawInput.trim().split("\n");

const problem1 = (contents: string[]) => {};

const problem2 = (contents: string[]) => {};

export const results = {
  part1: problem1(input),
  part2: problem2(input),
};
