import { readFile } from "fs/promises";

const rawTest = `#.##..##.
..#.##.#.
##......#
##......#
..#.##.#.
..##..##.
#.#.##.#.`;

const inputFilePath = new URL("./input.txt", import.meta.url);
const rawInput = await readFile(inputFilePath, { encoding: "utf-8" });
const input = rawInput.trim().split("\n\n");
const test = rawTest.trim().split("\n\n");

const getMatrices = (block: string) => {
  const matrix2d = block.split("\n").map((line) => line.split(""));
  const transposed2D = matrix2d[0].map((_, i) => matrix2d.map((row) => row[i]));
  return { matrix2d, transposed2D };
};

const findMirrorLine = (block: string[][]) =>
  Array.from({ length: block.length - 1 })
    .map((_, index) => {
      const above = block.slice(0, index + 1).reverse();
      const below = block.slice(index + 1);
      const [minimum, maximum] =
        above.length > below.length ? [below, above] : [above, below];

      if (minimum.every((row, i) => row.join("") === maximum[i].join("")))
        return index + 1;
      return undefined;
    })
    .find((value) => value !== undefined) ?? 0;

const lettersDiffering = (line1: string[], line2: string[]) =>
  line1.reduce((sum, char, index) => sum + Number(!(char === line2[index])), 0);

const findMirrorLineWithOneDiff = (block: string[][]) =>
  Array.from({ length: block.length - 1 })
    .map((_, index) => {
      const above = block.slice(0, index + 1).reverse();
      const below = block.slice(index + 1);
      const [minimum, maximum] =
        above.length > below.length ? [below, above] : [above, below];

      const difference = minimum.reduce((sum, minRow, i) => {
        const maxRow = maximum[i];
        return sum + lettersDiffering(minRow, maxRow);
      }, 0);

      if (difference === 1) return index + 1;
      return undefined;
    })
    .find((value) => value !== undefined) ?? 0;

const problem1 = (contents: string[]) => {
  return contents.reduce((sum, block) => {
    const { matrix2d, transposed2D } = getMatrices(block);
    const row = findMirrorLine(matrix2d);
    const column = findMirrorLine(transposed2D);
    return sum + row * 100 + column;
  }, 0);
};

const problem2 = (contents: string[]) => {
  return contents.reduce((sum, block) => {
    const { matrix2d, transposed2D } = getMatrices(block);
    const row = findMirrorLineWithOneDiff(matrix2d);
    const column = findMirrorLineWithOneDiff(transposed2D);
    return sum + row * 100 + column;
  }, 0);
};

export const results = {
  part1: problem1(input),
  part2: problem2(input),
};

export const testResults = {
  part1: problem1(test),
  part2: problem2(test),
};
