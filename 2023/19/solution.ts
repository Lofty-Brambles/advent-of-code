import { readFile } from "fs/promises";

const rawTest = `px{a<2006:qkq,m>2090:A,rfg}
pv{a>1716:R,A}
lnx{m>1548:A,A}
rfg{s<537:gd,x>2440:R,A}
qs{s>3448:A,lnx}
qkq{x<1416:A,crn}
crn{x>2662:A,R}
in{s<1351:px,qqz}
qqz{s>2770:qs,m<1801:hdj,R}
gd{a>3333:R,R}
hdj{m>838:A,pv}

{x=787,m=2655,a=1222,s=2876}
{x=1679,m=44,a=2067,s=496}
{x=2036,m=264,a=79,s=2244}
{x=2461,m=1339,a=466,s=291}
{x=2127,m=1623,a=2188,s=1013}`;

const inputFilePath = new URL("./input.txt", import.meta.url);
const rawInput = await readFile(inputFilePath, { encoding: "utf-8" });
const input = rawInput.trim().split("\n\n");
const test = rawTest.trim().split("\n\n");

type Comparision = { key: string; operator: string; number: number };
type Rule = { rule?: Comparision; target: string };
type WorkFlows = Record<string, Rule[]>;

type NodeKeys = "x" | "m" | "a" | "s";
type Node = Record<NodeKeys, string>;

type Ranges = Record<string, number[]>;

const parseInput = ([rawWorkflows, starts]: string[]) => {
  const workflows = {} as WorkFlows;
  rawWorkflows.split("\n").forEach((line) => {
    const [name, rules] = line.split(/[}{]/);
    workflows[name] = rules.split(",").map((statement) => {
      const [target, rule] = statement.split(":").reverse();
      if (rule === undefined) return { target };
      const [key, operator, ...number] = rule.split("");
      return { rule: { key, operator, number: +number.join("") }, target };
    });
  });

  const parts: Node[] = starts.split("\n").map((line) => {
    const stripped = line.slice(1, -1).split(",");
    const data = Object.fromEntries(stripped.map((eq) => eq.split("=")));
    return data;
  });

  return { workflows, parts };
};

const OPERATION: Record<string, Function> = {
  ">": (number1: number, number2: number) => number1 > number2,
  "<": (number1: number, number2: number) => number1 < number2,
};

const isAccepted = (workflows: WorkFlows) => {
  const recursor = (part: Node, name: string = "in"): boolean => {
    if (name === "R") return false;
    if (name === "A") return true;

    const rules = workflows[name];
    const fallback = rules.at(-1)!.target;

    for (const { rule, target } of rules.slice(0, -1)) {
      const operation = OPERATION[rule?.operator!];
      const key = rule?.key as NodeKeys;
      if (operation(part[key], rule?.number)) return recursor(part, target);
    }

    return recursor(part, fallback);
  };

  return (part: Node) => recursor(part);
};

const count = (workflows: WorkFlows) => {
  const recurse = (ranges: Ranges, name: string = "in") => {
    const getRange = (product: number, [low, high]: number[]) =>
      product * (high - low + 1);
    if (name === "A") return Object.values(ranges).reduce(getRange, 1);
    if (name === "R") return 0;

    let total = 0;
    const rules = workflows[name];

    for (const { rule, target } of rules) {
      if (rule === undefined) {
        total += recurse(ranges, rules.at(-1)!.target);
        continue;
      }

      const copied: Ranges = JSON.parse(JSON.stringify(ranges));
      const currentRange = ranges[rule?.key!];
      if (rule?.number! <= currentRange[0] || rule?.number! >= currentRange[1])
        continue;

      if (rule?.operator === "<") {
        copied[rule?.key] = [currentRange[0], rule.number - 1];
        ranges[rule?.key] = [rule.number, currentRange[1]];
      } else if (rule?.operator === ">") {
        copied[rule?.key] = [rule.number + 1, currentRange[1]];
        ranges[rule?.key] = [currentRange[0], rule.number];
      }

      total += recurse(copied, target);
    }

    return total;
  };

  return (ranges: Ranges) => recurse(ranges);
};

const problem1 = (contents: string[]) => {
  const { parts, workflows } = parseInput(contents);
  return parts
    .filter(isAccepted(workflows))
    .map((part) => Object.values(part).reduce((sum, num) => +num + sum, 0))
    .reduce((sum, num) => sum + num, 0);
};

const problem2 = (contents: string[]) => {
  const { workflows } = parseInput(contents);
  const ranges = "xmas".split("").map((key) => [key, [1, 4000]]);
  return count(workflows)(Object.fromEntries(ranges));
};

export const results = {
  part1: problem1(input),
  part2: problem2(input),
};

export const testResults = {
  part1: problem1(test),
  part2: problem2(test),
};
