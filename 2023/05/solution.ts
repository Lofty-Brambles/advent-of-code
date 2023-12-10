import { Callback } from "clipanion/lib/core";
import { readFile } from "fs/promises";

const rawTest = `seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4`;

const inputFilePath = new URL("./input.txt", import.meta.url);
const rawInput = await readFile(inputFilePath, { encoding: "utf-8" });
const cutout = (string: string, seperator: string) =>
  string.trim().split(seperator);
const input = cutout(rawInput, "\n\n").map((line) => cutout(line, "\n"));
const test = cutout(rawTest, "\n\n").map((line) => cutout(line, "\n"));

type ReduceWithBreakParams<T, U> = {
  array: T[];
  initial: U;
  callback: (
    previousValue: U,
    currentValue: T,
    index: number,
    array: T[]
  ) => { newValue: U; breaks: boolean };
};
const reduceWithBreak = <T, U>(params: ReduceWithBreakParams<T, U>) => {
  let buffer = params.initial;
  for (const [index, element] of params.array.entries()) {
    const result = params.callback(buffer, element, index, params.array);
    buffer = result.newValue;
    if (result.breaks) break;
  }
  return buffer;
};

const shiftSeed = (seed: number, range: number[]) => {
  const [start, end, diff] = range;
  const newSeed = seed >= start && seed <= end ? seed + diff : seed;
  return { newValue: newSeed, breaks: seed !== newSeed };
};

const shiftLocation = (location: number, range: number[]) => {
  return shiftSeed(location, range);
};

const getLocationFromSeed = (givenSeed: number, maps: number[][][]) =>
  maps.reduce((initial, ranges) => {
    return reduceWithBreak({ array: ranges, initial, callback: shiftSeed });
  }, givenSeed);

const getSeedFromLocation = (givenLocation: number, maps: number[][][]) =>
  maps.reduce((initial, ranges) => {
    return reduceWithBreak({ array: ranges, initial, callback: shiftLocation });
  }, givenLocation);

type Range = { start: number; end: number };
const seedExists = (seed: number, ranges: Range[]) =>
  ranges.some(({ start, end }) => seed >= start && seed <= end);

const problem1 = (contents: string[][]) => {
  const seeds = contents[0][0].split(":")[1].trim().split(" ");
  const maps = contents.slice(1).map((map) => {
    const ranges = map.slice(1).map((range) => range.split(" ").map(Number));
    const redefineRanges = ([destination, source, range]: number[]) => {
      return [source, source + range, destination - source];
    };
    return ranges.map(redefineRanges);
  });

  const locations = seeds.map((seed) => getLocationFromSeed(+seed, maps));
  return Math.min(...locations);
};

const problem2 = (contents: string[][]) => {
  const seedArray = contents[0][0].split(":")[1].trim().split(" ");
  const seedsRanges = seedArray.reduce((ranges, value, index) => {
    if (index % 2 === 1) return ranges;
    const nextNumber = Number(seedArray[index + 1]);
    ranges.push({ start: +value, end: Number(value) + nextNumber });
    return ranges;
  }, [] as Range[]);

  // prettier-ignore
  const invertMaps = contents.slice(1).reverse().map((map) => {
    const ranges = map.slice(1).map((range) => range.split(" ").map(Number));
    const redefineRanges = ([destination, source, range]: number[]) => {
      return [destination, destination + range, source - destination];
    };
    return ranges.map(redefineRanges);
  });

  for (let location = 0; ; location++) {
    const seed = getSeedFromLocation(location, invertMaps);
    if (seedExists(seed, seedsRanges)) return location;
  }
};

export const results = {
  part1: problem1(input),
  part2: problem2(input),
};

export const testResults = {
  part1: problem1(test),
  part2: problem2(test),
};
