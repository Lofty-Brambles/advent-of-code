import { readFile } from "fs/promises";

const rawTest = `LLR

AAA = (BBB, BBB)
BBB = (AAA, ZZZ)
ZZZ = (ZZZ, ZZZ)`;

const inputFilePath = new URL("./input.txt", import.meta.url);
const rawInput = await readFile(inputFilePath, { encoding: "utf-8" });
const input = rawInput.trim().split("\n");
const test = rawTest.trim().split("\n");

type Mapping = { L: string; R: string };
type Collection = Record<string, Mapping>;

const processInput = (contents: string[]) => {
  const [directions, _, ...routeMap] = contents;
  const collection = routeMap.reduce((collection, line) => {
    const left = line.slice(7, 10);
    const right = line.slice(12, 15);
    collection[line.slice(0, 3)] = { L: left, R: right };
    return collection;
  }, {} as Collection);

  return { directions, collection };
};

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

const findLCM = (numberA: number, numberB: number) => {
  const findGCD = (numberA: number, numberB: number): number =>
    numberB === 0 ? numberA : findGCD(numberB, numberA % numberB);
  return (numberA * numberB) / findGCD(numberA, numberB);
};

const problem1 = (contents: string[]) => {
  const { directions, collection } = processInput(contents);
  const START = "AAA";
  const END = "ZZZ";

  let stepCounter = 0;
  let current: string = START;
  const processIfNotFound = (directionNumber: number) => {
    stepCounter++;
    current = collection[current][directions[directionNumber] as "L" | "R"];
  };

  const oneLoopOfDirections = () =>
    loopHandler({
      callback: processIfNotFound,
      exitFx: (indexOfDirection) => indexOfDirection < directions.length,
      breakFx: () => current === END,
    });

  loopHandler({
    callback: oneLoopOfDirections,
    exitFx: () => current !== END,
  });

  return stepCounter;
};

const problem2 = (contents: string[]) => {
  const { directions, collection } = processInput(contents);
  const starts = Object.keys(collection).filter((name) => name.endsWith("A"));
  const endsTest = (segment: string) => segment.endsWith("Z");

  const steps = starts.map((startSegment) => {
    let stepCounter = 0;
    let current = startSegment;
    const processIfNotFound = (directionNumber: number) => {
      stepCounter++;
      current = collection[current][directions[directionNumber] as "L" | "R"];
    };

    const oneLoopOfDirections = () =>
      loopHandler({
        callback: processIfNotFound,
        exitFx: (indexOfDirection) => indexOfDirection < directions.length,
        breakFx: () => endsTest(current),
      });

    loopHandler({
      callback: oneLoopOfDirections,
      exitFx: () => !endsTest(current),
    });

    return stepCounter;
  });

  return steps.reduce((lcm, number) => findLCM(lcm, number));
};

export const results = {
  part1: problem1(input),
  part2: problem2(input),
};

export const testResults = {
  part1: problem1(test),
  part2: problem2(test),
};
