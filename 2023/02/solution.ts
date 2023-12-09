import { readFile } from "fs/promises";

const rawTest = `Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`;

const inputFilePath = new URL("./input.txt", import.meta.url);
const rawInput = await readFile(inputFilePath, { encoding: "utf-8" });
const input = rawInput.trim().split("\n");
const test = rawTest.trim().split("\n");

type Bucket = typeof Game.EMPTY_BUCKET;
type RGB = keyof Bucket;

class Game {
  id: number;
  #rounds: string[][];
  static MAX_BUCKET_LOAD = { red: 12, green: 13, blue: 14 };
  static EMPTY_BUCKET = { red: 0, green: 0, blue: 0 };

  constructor(id: number, rounds: string[]) {
    this.id = id;
    this.#rounds = rounds.map((element) => element.trim().split(" "));
  }

  isPossible() {
    const comparecolorCount = ([number, color]: string[]) =>
      +number <= Game.MAX_BUCKET_LOAD[color as RGB];
    return this.#rounds.every(comparecolorCount);
  }

  #maxBucketCapacity() {
    const adjustcolor = (bucket: Bucket, [number, color]: string[]) =>
      Math.max(+number, bucket[color as RGB]);

    const adjustCapacity = (bucket: Bucket, [number, color]: string[]) => {
      return { ...bucket, [color]: adjustcolor(bucket, [number, color]) };
    };
    return this.#rounds.reduce(adjustCapacity, Game.EMPTY_BUCKET);
  }

  getPower() {
    const loads = Object.values(this.#maxBucketCapacity());
    return loads.reduce((product, number) => product * number, 1);
  }
}

const processLine = (line: string, index: number) => {
  const SEPERATORS = /[,:;]/g;
  return new Game(index + 1, line.split(SEPERATORS).slice(1));
};

const problem1 = (contents: string[]) => {
  return contents
    .map(processLine)
    .reduce((sum, game) => (game.isPossible() ? game.id + sum : sum), 0);
};

const problem2 = (contents: string[]) => {
  return contents
    .map(processLine)
    .reduce((sum, game) => sum + game.getPower(), 0);
};

export const results = {
  part1: problem1(input),
  part2: problem2(input),
};

export const testResults = {
  part1: problem1(test),
  part2: problem2(test),
};
