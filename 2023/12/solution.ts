import { readFile } from "fs/promises";

const rawTest = `???.### 1,1,3
.??..??...?##. 1,1,3
?#?#?#?#?#?#?#? 1,3,1,6
????.#...#... 4,1,1
????.######..#####. 1,6,5
?###???????? 3,2,1`;

const inputFilePath = new URL("./input.txt", import.meta.url);
const rawInput = await readFile(inputFilePath, { encoding: "utf-8" });
const input = rawInput.trim().split("\n");
const test = rawTest.trim().split("\n");

type Method<T extends unknown[], U> = (...args: T) => U;
export function memoize<T extends unknown[], U>(method: Method<T, U>) {
  const stored = new Map<string, U>();
  return (...args: T) => {
    const keys = JSON.stringify(args);
    if (stored.has(keys)) return stored.get(keys)!;
    const result = method(...args);
    stored.set(keys, result);
    return result;
  };
}

const tally = memoize((line: string, numbers: number[]): number => {
  if (line.length === 0) return Number(numbers.length === 0);

  if (numbers.length === 0) return Number(!line.includes("#"));

  const sum = numbers.reduce((sum, number) => sum + number, 0);
  if (line.length < sum + numbers.length - 1) return 0;

  if (line[0] === ".") return tally(line.slice(1), numbers);

  if (line[0] === "#") {
    if (line.slice(0, numbers[0]).includes(".") || line[numbers[0]] === "#")
      return 0;
    return tally(line.slice(numbers[0] + 1), numbers.slice(1));
  }

  return (
    tally(`#${line.slice(1)}`, numbers) + tally(`.${line.slice(1)}`, numbers)
  );
});

const problem1 = (contents: string[]) => {
  return contents.reduce((sum, line) => {
    const [config, numbers] = line.split(" ");
    return sum + tally(config, numbers.split(",").map(Number));
  }, 0);
};

const problem2 = (contents: string[]) => {
  return contents.reduce((sum, line) => {
    let [config, numbers] = line.split(" ");
    config = Array(5).fill(config).join("?");
    numbers = Array(5).fill(numbers).join(",");
    return sum + tally(config, numbers.split(",").map(Number));
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
