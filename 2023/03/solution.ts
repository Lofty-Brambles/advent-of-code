import { readFile } from "fs/promises";

const rawTest = `467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598.`;

const inputFilePath = new URL("./input.txt", import.meta.url);
const rawInput = await readFile(inputFilePath, { encoding: "utf-8" });
const input = rawInput.trim().split("\n");
const test = rawTest.trim().split("\n");

type Callback = (character: string, row: number, column: number) => void;
const passThrough = (input: string[], callback: Callback) =>
  input.forEach((line, row) =>
    line.split("").forEach((char, col) => callback(char, row, col))
  );

const allDigits = Array.from({ length: 10 }, (_, index) => String(index));
const confirmDigit = (value: string) => allDigits.includes(value);
const confirmSymbol = (value: string) => ![...allDigits, "."].includes(value);
const confirmStar = (value: string) => value === "*";

type Coord = { row: number; column: number };
const getShiftedCoords = (position: number) => {
  const COORDINATE_SHIFTS = [-1, 0, 1];
  return COORDINATE_SHIFTS.map((shift) => position + shift);
};
const getShiftedMatrix = (position: Coord) => ({
  rows: getShiftedCoords(position.row),
  columns: getShiftedCoords(position.column),
});

const get3x3Coords = (position: Coord) => {
  const matrix3x3 = getShiftedMatrix(position);
  const stringifiedCoords: string[] = [];
  matrix3x3.rows.forEach((row) =>
    matrix3x3.columns.forEach((column) =>
      stringifiedCoords.push(`${row}|${column}`)
    )
  );
  return stringifiedCoords;
};

const fill3x3AboutCenter = <T>(matrix: T[][], value: T, position: Coord) => {
  const matrix3x3 = getShiftedMatrix(position);
  matrix3x3.rows.forEach((row) =>
    matrix3x3.columns.forEach((column) => (matrix[row][column] = value))
  );
};

const problem1 = (contents: string[]) => {
  const maxRows = contents.length;
  const maxColumns = contents[0].length;
  const positionMatrix = Array.from({ length: maxRows }, (_) =>
    Array.from({ length: maxColumns }, () => false)
  );

  passThrough(contents, (character, row, column) => {
    if (confirmSymbol(character))
      fill3x3AboutCenter(positionMatrix, true, { row, column });
  });

  const partNumbers: number[] = [];

  let digitQueue: string[] = [];
  let hitFlag = false;
  const resetTrackers = () => {
    if (hitFlag === true) partNumbers.push(+digitQueue.join(""));
    digitQueue = [];
    hitFlag = false;
  };

  passThrough(contents, (character, row, column) => {
    if (confirmDigit(character)) {
      digitQueue.push(character);
      if (positionMatrix[row][column] === true) hitFlag = true;
    }
    if (!confirmDigit(character) && digitQueue.length > 0) resetTrackers();
    if (column === maxColumns) resetTrackers();
  });

  return partNumbers.reduce((sum, number) => sum + number, 0);
};

const problem2 = (contents: string[]) => {
  const maxColumns = contents[0].length;
  const numberMap: Record<string, number> = {};

  let positionList: string[] = [];
  let digitQueue: string[] = [];
  let hitFlag = false;
  const resetTrackers = () => {
    const number = +digitQueue.join("");
    if (hitFlag === true)
      positionList.forEach((position) => (numberMap[position] = number));

    positionList = [];
    digitQueue = [];
    hitFlag = false;
  };

  passThrough(contents, (character, row, column) => {
    if (confirmDigit(character)) {
      digitQueue.push(character);
      positionList.push(`${row}|${column}`);
      hitFlag = true;
    }
    if (!confirmDigit(character) && digitQueue.length > 0) resetTrackers();
    if (column === maxColumns) resetTrackers();
  });

  const gearRatios: number[] = [];
  passThrough(contents, (character, row, column) => {
    if (!confirmStar(character)) return;
    const gearSurroundings = get3x3Coords({ row, column });
    const numbersAboutGear = gearSurroundings
      .map((coord) => numberMap[coord])
      .filter((number) => number !== undefined)
      .filter((number, index, array) => array.indexOf(number) === index);
    if (numbersAboutGear.length === 2)
      gearRatios.push(numbersAboutGear[0] * numbersAboutGear[1]);
  });

  return gearRatios.reduce((sum, number) => sum + number, 0);
};

export const results = {
  part1: problem1(input),
  part2: problem2(input),
};

export const testResults = {
  part1: problem1(test),
  part2: problem2(test),
};
