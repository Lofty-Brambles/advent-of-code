import { readFile } from "fs/promises";

const rawTest = `.|...\....
|.-.\.....
.....|-...
........|.
..........
.........\
..../.\\..
.-.-/..|..
.|....-|.\
..//.|...`;

const inputFilePath = new URL("./input.txt", import.meta.url);
const rawInput = await readFile(inputFilePath, { encoding: "utf-8" });
const input = rawInput.trim().split("\n");
const test = rawTest.trim().split("\n");

type Direction = "down" | "right" | "up" | "left";
type Cell = { char: string; visited: Direction[] };
const parser = (contents: string[]): Cell[][] =>
  contents.map((line) => line.split("").map((char) => ({ char, visited: [] })));

const move = (map: Cell[][], [row, column]: number[], way: Direction) => {
  const current = map[row]?.[column];
  if (!current || current.visited.includes(way)) return;
  current.visited.push(way);

  const queue: [[number, number], Direction][] = [];
  switch (current.char) {
    case ".":
      if (way === "down") queue.push([[row + 1, column], "down"]);
      if (way === "right") queue.push([[row, column + 1], "right"]);
      if (way === "up") queue.push([[row - 1, column], "up"]);
      if (way === "left") queue.push([[row, column - 1], "left"]);
      break;
    case "/":
      if (way === "down") queue.push([[row, column - 1], "left"]);
      if (way === "right") queue.push([[row - 1, column], "up"]);
      if (way === "up") queue.push([[row, column + 1], "right"]);
      if (way === "left") queue.push([[row + 1, column], "down"]);
      break;
    case "\\":
      if (way === "down") queue.push([[row, column + 1], "right"]);
      if (way === "right") queue.push([[row + 1, column], "down"]);
      if (way === "up") queue.push([[row, column - 1], "left"]);
      if (way === "left") queue.push([[row - 1, column], "up"]);
      break;
    case "-":
      if (way !== "left") queue.push([[row, column + 1], "right"]);
      if (way !== "right") queue.push([[row, column - 1], "left"]);
      break;
    case "|":
      if (way !== "down") queue.push([[row - 1, column], "up"]);
      if (way !== "up") queue.push([[row + 1, column], "down"]);
      break;
  }

  queue.forEach((nextItem) => move(map, ...nextItem));
};

const getVisited = (map: Cell[][]) =>
  map.reduce((rowSum, row) => {
    // prettier-ignore
    return rowSum + row.reduce((cellSum, cell) => {
      return cellSum + (cell.visited.length ? 1 : 0);
    }, 0);
  }, 0);

const problem1 = (contents: string[]) => {
  const map = parser(contents);
  move(map, [0, 0], "right");
  return getVisited(map);
};

const problem2 = (contents: string[]) => {
  let highest = 0;
  const [MAX_ROW, MAX_COLUMN] = [contents.length, contents[0].length];
  const assignHighest = (row?: number, columnn?: number) => {
    const [map1, map2] = [0, 0].map(() => parser(contents));
    if (row !== undefined) {
      move(map1, [row, 0], "right");
      move(map2, [row, MAX_ROW - 1], "left");
    }
    if (columnn !== undefined) {
      move(map1, [0, columnn], "down");
      move(map2, [MAX_COLUMN - 1, columnn], "up");
    }
    highest = Math.max(getVisited(map1), getVisited(map2), highest);
  };

  Array.from({ length: MAX_ROW - 1 }, (_, i) => assignHighest(i));
  Array.from({ length: MAX_COLUMN - 1 }, (_, i) => assignHighest(undefined, i));
  return highest;
};

export const results = {
  part1: problem1(input),
  part2: problem2(input),
};

export const testResults = {
  part1: problem1(test),
  part2: problem2(test),
};
