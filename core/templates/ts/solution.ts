import { readFile } from "fs/promises";

const inputFilePath = new URL("./input.txt", import.meta.url);
const input = await readFile(inputFilePath, { encoding: "utf-8" });

const problem1 = (contents: string) => {};
const problem2 = (contents: string) => {};

console.log({
  problem1: problem1(input),
  problem2: problem2(input),
});
