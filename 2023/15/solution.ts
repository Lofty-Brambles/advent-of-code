import { readFile } from "fs/promises";

const rawTest = `rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7`;

const inputFilePath = new URL("./input.txt", import.meta.url);
const rawInput = await readFile(inputFilePath, { encoding: "utf-8" });
const input = rawInput.trim().split(",");
const test = rawTest.trim().split(",");

const hash = (current: string) => {
  return current.split("").reduce((code, character) => {
    return ((code + character.charCodeAt(0)) * 17) % 256;
  }, 0);
};

const problem1 = (contents: string[]) => {
  return contents.reduce((rest, current) => rest + hash(current), 0);
};

const problem2 = (contents: string[]) => {
  const boxes = Array.from({ length: 256 }, () => [] as string[]);
  const focalLengths = {} as Record<string, number>;
  const findPower = (boxNo: number, lensSlot: number, label: string) =>
    (boxNo + 1) * (lensSlot + 1) * focalLengths[label];

  contents.forEach((line) => {
    if (line.includes("-")) {
      const label = line.slice(0, -1);
      const boxNo = hash(label);
      const index = boxes[boxNo].indexOf(label);
      if (index !== -1) boxes[boxNo].splice(index, 1);
    } else {
      const [label, focalLength] = line.split("=");
      const boxNo = hash(label);
      focalLengths[label] = +focalLength;
      const index = boxes[boxNo].indexOf(label);
      if (index === -1) boxes[boxNo].push(label);
    }
  });

  const powers = boxes.map((box, boxNo) =>
    box.map((label, lensSlot) => findPower(boxNo, lensSlot, label)),
  );
  return powers.flat().reduce((sum, number) => sum + number, 0);
};

export const results = {
  part1: problem1(input),
  part2: problem2(input),
};

export const testResults = {
  part1: problem1(test),
  part2: problem2(test),
};
