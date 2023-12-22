import { readFile } from "fs/promises";

const rawTest = `R 6 (#70c710)
D 5 (#0dc571)
L 2 (#5713f0)
D 2 (#d2c081)
R 2 (#59c680)
D 2 (#411b91)
L 5 (#8ceee2)
U 2 (#caa173)
L 1 (#1b58a2)
U 2 (#caa171)
R 2 (#7807d2)
U 3 (#a77fa3)
L 2 (#015232)
U 2 (#7a21e3)`;

const inputFilePath = new URL("./input.txt", import.meta.url);
const rawInput = await readFile(inputFilePath, { encoding: "utf-8" });
const input = rawInput.trim().split("\n");
const test = rawTest.trim().split("\n");

type Point = [number, number];
type Shifts = Record<string, Point>;
const SHIFTS: Shifts = { U: [-1, 0], D: [1, 0], L: [0, -1], R: [0, 1] };
const NUM_SHIFTS: Shifts = { 3: [-1, 0], 1: [1, 0], 2: [0, -1], 0: [0, 1] };
const addUp = (point1: Point, point2: Point) =>
  [0, 1].map((index) => point1[index] + point2[index]) as Point;
const multiply = (point: Point, multiplier: number) =>
  [0, 1].map((index) => point[index] * multiplier) as Point;

const findArea = (points: Point[]) => {
  const crossMultiply = (point1: Point, point2: Point) =>
    point1[0] * point2[1] - point1[1] * point2[0];
  const summed = points.map((point, index) => {
    const nextPoint = points[index === points.length - 1 ? 0 : index + 1];
    return crossMultiply(point, nextPoint);
  });

  const moddedSum = Math.abs(summed.reduce((sum, number) => sum + number, 0));
  return Math.floor(moddedSum / 2);
};

const problem1 = (contents: string[]) => {
  const points: Point[] = [[0, 0]];
  const perimeterLengths: number[] = [];

  contents.forEach((line) => {
    const [direction, steps] = line.split(" ");
    perimeterLengths.push(+steps);
    const point = points.at(-1)!;
    points.push(addUp(multiply(SHIFTS[direction], +steps), point));
  });

  points.pop();
  const perimeterPoints = perimeterLengths.reduce((sum, num) => sum + num, 0);
  const area = findArea(points);
  return area + 1 - Math.floor(perimeterPoints / 2) + perimeterPoints;
};

const problem2 = (contents: string[]) => {
  const points: Point[] = [[0, 0]];
  const perimeterLengths: number[] = [];

  contents.forEach((line) => {
    const [, , hex] = line.split(" ");
    const steps = parseInt(hex.slice(2, -2), 16);
    perimeterLengths.push(steps);
    const point = points.at(-1)!;
    points.push(addUp(multiply(NUM_SHIFTS[hex.at(-2)!], steps), point));
  });

  points.pop();
  const perimeterPoints = perimeterLengths.reduce((sum, num) => sum + num, 0);
  const area = findArea(points);
  return area + 1 - Math.floor(perimeterPoints / 2) + perimeterPoints;
};

export const results = {
  part1: problem1(input),
  part2: problem2(input),
};

export const testResults = {
  part1: problem1(test),
  part2: problem2(test),
};
