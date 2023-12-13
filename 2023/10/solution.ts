import { readFile } from "fs/promises";

const rawTest = `FF7FSF7F7F7F7F7F---7
L|LJ||||||||||||F--J
FL-7LJLJ||||||LJL-77
F--JF--7||LJLJ7F7FJ-
L---JF-JLJ.||-FJLJJ7
|F|F-JF---7F7-L7L|7|
|FFJF7L7F-JF7|JL---7
7-L-JL7||F7|L7F-7F7|
L.L7LFJ|||||FJL7||LJ
L7JLJL-JLJLJL--JLJ.L`;

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

type Coordinate = [number, number];
type Vector = {
  direction: string;
  position: Coordinate;
  character: string;
};

const DIRECTIONS_ALLOWED: Record<string, Record<string, string>> = {
  "|": { up: "up", down: "down" },
  "-": { right: "right", left: "left" },
  "L": { down: "right", left: "up" },
  "J": { down: "left", right: "up" },
  "F": { left: "down", up: "right" },
  "7": { right: "down", up: "left" },
};

const isPipe = (character: string) => "|-LJF7".includes(character);
const isBend = (character: string) => "LJ7F".includes(character);
const isStartABend = (startVector: Vector, nextVector: Vector) =>
  startVector.direction !== nextVector.direction;

const MOVEMENTS: Record<string, (x: Coordinate) => Coordinate> = {
  up: ([x, y]: Coordinate) => [x - 1, y] as Coordinate,
  down: ([x, y]: Coordinate) => [x + 1, y] as Coordinate,
  left: ([x, y]: Coordinate) => [x, y - 1] as Coordinate,
  right: ([x, y]: Coordinate) => [x, y + 1] as Coordinate,
};

const traversal = (contents: string[]) => {
  const startRow = contents.findIndex((row) => row.includes("S"));
  const startColumn = contents[startRow].indexOf("S");
  const getCharAt = ([x, y]: Coordinate) =>
    x < 0 || y < 0 ? "." : contents[x][y];

  const [direction, fx] = Object.entries(MOVEMENTS).find(([entryFrom, fx]) => {
    const possibleNext = fx([startRow, startColumn]);
    const possibleNextPipe = getCharAt(possibleNext);
    return (
      isPipe(possibleNextPipe) &&
      Object.keys(DIRECTIONS_ALLOWED[possibleNextPipe]).includes(entryFrom)
    );
  })!;

  const position = fx([startRow, startColumn]);
  let currentVector = { direction, position, character: getCharAt(position) };
  const listOfPositions = [currentVector];

  loopHandler({
    exitFx: () => true,
    breakFx: () => getCharAt(currentVector.position) === "S",
    callback: () => {
      const allDirections = DIRECTIONS_ALLOWED[currentVector.character];
      const direction = allDirections[currentVector.direction];
      const position = MOVEMENTS[direction](currentVector.position);
      const character = getCharAt(position);

      currentVector = { direction, position, character };
      listOfPositions.push(currentVector);
    },
  });

  return listOfPositions;
};

const problem1 = (contents: string[]) => {
  return Math.floor(traversal(contents).length / 2);
};

const problem2 = (contents: string[]) => {
  const loopedPipes = traversal(contents);
  const startVector = loopedPipes.at(-1)!;
  const crossMultiply = (vector1: Vector, vector2: Vector) =>
  vector1.position[0] * vector2.position[1] -
  vector1.position[1] * vector2.position[0];
  
  const vertices = loopedPipes.filter(({ character }) => isBend(character));
  if (isStartABend(startVector, loopedPipes.at(0)!)) vertices.push(startVector);
  
  const summed = vertices.map((vertex, index) => {
    const nextVertex = vertices[index === vertices.length - 1 ? 0 : index + 1];
    return crossMultiply(vertex, nextVertex);
  });
  const moddedSum = Math.abs(summed.reduce((sum, number) => sum + number, 0));
  const area = Math.floor(moddedSum / 2);
  const halfBoundaryPoints = Math.floor(loopedPipes.length / 2);

  return area - halfBoundaryPoints + 1;
};

export const results = {
  part1: problem1(input),
  part2: problem2(input),
};

export const testResults = {
  part1: problem1(test),
  part2: problem2(test),
};
