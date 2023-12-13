import { readFile } from "fs/promises";

const rawTest = `...#......
.......#..
#.........
..........
......#...
.#........
.........#
..........
.......#..
#...#.....`;

const inputFilePath = new URL("./input.txt", import.meta.url);
const rawInput = await readFile(inputFilePath, { encoding: "utf-8" });
const input = rawInput.trim().split("\n");
const test = rawTest.trim().split("\n");

const getGalaxies = (lines: string[], factor: number) => {
  const mockRow = Array.from({ length: lines[0].length }, (_) => true);
  const galaxyPositions: [number, number][] = [];
  let rowNumber = 0;

  lines.forEach((line) => {
    const galaxiesInLine = [...line.matchAll(/#/g)].map((_) => _.index!);
    galaxiesInLine.forEach((index) => {
      mockRow[index] = false;
      galaxyPositions.push([rowNumber, index]);
    });
    rowNumber += galaxiesInLine.length === 0 ? factor : 1;
  });

  galaxyPositions.forEach((position) => {
    const rowsExpandedAhead = mockRow.reduce((rows, current, index) => {
      if (position[1] > index && current) return rows + factor - 1;
      else return rows;
    }, 0);
    position[1] += rowsExpandedAhead;
  });

  return galaxyPositions;
};

type Coord = [number, number];
const sumUp = (array: number[]) => array.reduce((sum, value) => sum + value, 0);
const distance = (position1: Coord, position2: Coord) => {
  const absDistance = (index: number) =>
    Math.abs(position1[index] - position2[index]);
  return [0, 1].reduce((sum, index) => sum + absDistance(index), 0);
};

const problem1 = (contents: string[]) => {
  const expandedGalaxies = getGalaxies(contents, 2);
  return expandedGalaxies.reduce((sum, first, index) => {
    const checkable = expandedGalaxies.slice(index + 1);
    return sum + sumUp(checkable.map((second) => distance(first, second)));
  }, 0);
};

const problem2 = (contents: string[]) => {
  const expandedGalaxies = getGalaxies(contents, 1_000_000);
  return expandedGalaxies.reduce((sum, first, index) => {
    const checkable = expandedGalaxies.slice(index + 1);
    return sum + sumUp(checkable.map((second) => distance(first, second)));
  }, 0);;
};

export const results = {
  part1: problem1(input),
  part2: problem2(input),
};

export const testResults = {
  part1: problem1(test),
  part2: problem2(test),
};
