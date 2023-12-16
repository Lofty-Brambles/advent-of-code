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

type FunctionalArgs = {
  callback: (index: number) => unknown;
  exitFx: (index: number) => boolean;
  breakFx?: (index: number) => boolean;
};
const loopHandler = ({ callback, exitFx, breakFx }: FunctionalArgs) => {
  for (let index = 0; exitFx(index); index++) {
    if (breakFx && breakFx(index)) break;
    callback(index);
  }
};

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
  let matrix = contents.map((line) => line.split(""));
  const cache: string[] = [];
  const toString = (matrix: string[][]) =>
    matrix.map((line) => line.join("")).join("\n");

  loopHandler({
    exitFx: (index) => index < 1_000_000_000,
    callback: () => {
      cache.push(toString(matrix));
      matrix = cycle(matrix);
      console.log(matrix.map(v=>v.join("")).join("\n") + "\n");
    },
    breakFx: () => cache.includes(toString(matrix)),
  });
  return getNorthLoad(matrix);
};

// export const results = {
//   part1: problem1(input),
//   part2: problem2(input),
// };

export const testResults = {
  part1: problem1(test),
  part2: problem2(test),
};
