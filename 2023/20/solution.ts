import { readFile } from "fs/promises";

const rawTest = `broadcaster -> a
%a -> inv, con
&inv -> b
%b -> con
&con -> output`;

const inputFilePath = new URL("./input.txt", import.meta.url);
const rawInput = await readFile(inputFilePath, { encoding: "utf-8" });
const input = rawInput.trim().split("\n");
const test = rawTest.trim().split("\n");

type ModuleType = "*" | "%" | "&";
type ModuleArray = [string, ModuleType, string[]];

const parseLine = (line: string): ModuleArray => {
  const [module, destinationString] = line.split(" -> ");
  const destinations = destinationString.split(", ");
  if (module === "broadcaster") return ["broadcaster", "*", destinations];
  return [module.slice(1), module[0], destinations] as ModuleArray;
};

type InputRecord<T> = Record<string, T>;
type Conjunction = { type: "&"; state: InputRecord<boolean>; maps: string[] };
type FlipFlop = { type: "%"; state: boolean; maps: string[] };
type Broadcaster = { type: "*"; maps: string[] };
type Module = Conjunction | FlipFlop | Broadcaster;

const moduleMapper = (modules: ModuleArray[]) => {
  const map = new Map<string, Module>();
  const positives: InputRecord<number> = {};
  modules.forEach(([key, type, maps]) => {
    if (type === "*") return map.set(key, { type: "*", maps });
    if (type === "%") return map.set(key, { type: "%", state: false, maps });

    const inputs = modules.filter((module) => module[2].includes(key));
    const state = Object.fromEntries(inputs.map((mod) => [mod[0], false]));
    if (maps.includes("rx")) positives[key] = 0;
    return map.set(key, { type: "&", state, maps });
  });

  return { map, positives };
};

type Count = { presses: number; high: number; low: number };
const pressButton = (
  map: Map<string, Module>,
  positives: InputRecord<number>,
  count: Count = { presses: 0, high: 0, low: 0 },
) => {
  type QueueMember = [string, string, boolean];
  const queue: QueueMember[] = [["button", "broadcaster", false]];
  count.presses++;

  const pushToQueue = (name: string, module: Module, pulse: boolean) =>
    module.maps.forEach((next) => queue.push([name, next, pulse]));

  while (queue.length) {
    const [source, triggered, pulseType] = queue.shift()!;
    count[pulseType === true ? "high" : "low"] += 1;
    if (triggered === "rx" && pulseType === false && positives[source] === 0)
      positives[source] = count.presses;

    const module = map.get(triggered) ?? { type: "none" };
    if (module.type === "*") {
      pushToQueue(triggered, module, false);
    } else if (module.type === "%") {
      if (pulseType === true) continue;
      module.state = !module.state;
      pushToQueue(triggered, module, module.state);
    } else if (module.type === "&") {
      module.state[source] = pulseType;
      const isEvery = Object.values(module.state).every((value) => value);
      pushToQueue(triggered, module, !isEvery);
    }
  }

  return count;
};

const findLCM = (numberA: number, numberB: number) => {
  const findGCD = (numberA: number, numberB: number): number =>
    numberB === 0 ? numberA : findGCD(numberB, numberA % numberB);
  return (numberA * numberB) / findGCD(numberA, numberB);
};

const problem1 = (contents: string[]) => {
  const { map, positives } = moduleMapper(contents.map(parseLine));
  let count = pressButton(map, positives);
  while (count.presses < 1_000) count = pressButton(map, positives, count);
  return count.low * count.high;
};

const problem2 = (contents: string[]) => {
  const { map, positives } = moduleMapper(contents.map(parseLine));
  let count = pressButton(map, positives);
  while (Object.values(positives).includes(0))
    count = pressButton(map, positives, count);

  console.log(
    positives.length === 1
      ? Object.values(positives)[0]
      : Object.values(positives).reduce(findLCM),
  );
};

export const results = {
  part1: problem1(input),
  part2: problem2(input),
};

// export const testResults = {
//   part1: problem1(test),
//   part2: problem2(test),
// };
