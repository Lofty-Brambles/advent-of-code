import { readFile } from "fs/promises";

const inputFilePath = new URL("./input.txt", import.meta.url);
const rawInput = await readFile(inputFilePath, { encoding: "utf-8" });
const input = rawInput.trim();

const problem1 = (contents: string) => {};

const problem2 = (contents: string) => {};

console.log({
  part1: problem1,
  part2: problem2,
} satisfies);
