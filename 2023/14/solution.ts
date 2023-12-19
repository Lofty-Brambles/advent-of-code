import { readFile } from "fs/promises";

const rawTest = `O....#....
O.OO#....#
.....##...
OO.#O....O
.O.....O#.
O.#..O.#.#
..O..#O..O
.......O..
#....###..
#OO..#....`;

const inputFilePath = new URL("./input.txt", import.meta.url);
const rawInput = await readFile(inputFilePath, { encoding: "utf-8" });
const input = rawInput.trim().split("\n");
const test = rawTest.trim().split("\n");

type Type = "before" | "after";
const splitMany = <T>(array: T[], condition: (x: T) => Boolean, type: Type) => {
  const tally = { result: [] as T[][], temp: [] as T[] };
  array.forEach((element) => {
    if (!condition(element)) return tally.temp.push(element);
    if (type === "before") {
      tally.result.push(tally.temp);
      return (tally.temp = [element]);
    } else {
      tally.result.push([...tally.temp, element]);
      return (tally.temp = []);
    }
  });
  tally.result.push(tally.temp);
  return tally.result;
};

const roll = (row: string[], order: string[], type: Type) => {
  const all = splitMany(row, (character) => character === "#", type);
  all.forEach((set) => set.sort((a, b) => order.indexOf(a) - order.indexOf(b)));
  return all.flat();
};

const transpose = <T>(array: T[][]) =>
  array[0].map((_, index) => array.map((row) => row[index]));

const ASCENDING_ORDER = [".", "O", "#"];
const DESCENDING_ORDER = ["#", "O", "."];

const tiltWest = (contents: string[][]) =>
  contents.map((row) => roll(row, DESCENDING_ORDER, "before"));
const tiltNorth = (contents: string[][]) =>
  transpose(tiltWest(transpose(contents)));
const tiltEast = (contents: string[][]) =>
  contents.map((row) => roll(row, ASCENDING_ORDER, "after"));
const tiltSouth = (contents: string[][]) =>
  transpose(tiltEast(transpose(contents)));
const cycle = (contents: string[][]) =>
  tiltEast(tiltSouth(tiltWest(tiltNorth(contents))));

const getNorthLoad = (contents: string[][]) =>
  transpose(contents).reduce((sum, row) => {
    const score = row.reverse().reduce((tally, element, index) => {
      return tally + (element === "O" ? index + 1 : 0);
    }, 0);
    return score + sum;
  }, 0);

const problem1 = (contents: string[]) => {
  const matrix = contents.map((line) => line.split(""));
  return getNorthLoad(tiltNorth(matrix));
};

const problem2 = (contents: string[]) => {
  const matrix = contents.map((line) => line.split(""));
  const LOOPS = 1_000_000_000;
  const cache: string[] = [];
  const toString = (matrix: string[][]) =>
    matrix.map((line) => line.join("")).join("\n");
  const fromString = (string: string) =>
    string.split("\n").map((line) => line.split(""));

  let loopData = { matrix, stopAt: -1, index: -1 };
  for (let index = 0; index < LOOPS; index++) {
    loopData.matrix = cycle(loopData.matrix);
    const matrixString = toString(loopData.matrix);
    loopData.index = cache.findIndex((map) => map === matrixString);
    loopData.stopAt = index;
    if (loopData.index !== -1) break;
    cache.push(matrixString);
  }

  const rest =
    ((LOOPS - loopData.index - 1) % (loopData.stopAt - loopData.index)) +
    loopData.index;
  return getNorthLoad(fromString(cache[rest]));
};

export const results = {
  part1: problem1(input),
  part2: problem2(input),
};

export const testResults = {
  part1: problem1(test),
  part2: problem2(test),
};
