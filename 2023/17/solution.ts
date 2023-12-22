import { readFile } from "fs/promises";

const rawTest = `2413432311323
3215453535623
3255245654254
3446585845452
4546657867536
1438598798454
4457876987766
3637877979653
4654967986887
4564679986453
1224686865563
2546548887735
4322674655533`;

const inputFilePath = new URL("./input.txt", import.meta.url);
const rawInput = await readFile(inputFilePath, { encoding: "utf-8" });
const input = rawInput.trim().split("\n");
const test = rawTest.trim().split("\n");

// prettier-ignore
const DIR = [[0, -1], [1, 0], [0, 1], [-1, 0]];

// https://stackoverflow.com/a/66511107/4235871
// prettier-ignore
// @ts-ignore
const heap={siftDown(h,i=0,v=h[i]){if(i<h.length){let k=v[0];while(1){let j=i*2+1;if(j+1<h.length&&h[j][0]>h[j+1][0])j++;if(j>=h.length||k<=h[j][0])break;h[i]=h[j];i=j;}h[i]=v}},heapify(h){for(let i=h.length>>1;i--;)this.siftDown(h,i);return h},pop(h){return this.exchange(h,h.pop())},exchange(h,v){if(!h.length)return v;let w=h[0];this.siftDown(h,0,v);return w},push(h,v){let k=v[0],i=h.length,j;while((j=(i-1)>>1)>=0&&k<h[j][0]){h[i]=h[j];i=j}h[i]=v;return h}};

type Condition = (p: number, s: number) => boolean;
const BFS = (condition: Condition) => (grid: number[][]) => {
  const visited = new Map();
  const hash = (x: number, y: number, h: number, s: number) =>
    `${x}-${y}-${h}-${s}`;
  const [tx, ty] = [grid[0].length - 1, grid.length - 1];
  const queue = [1, 2].map((n) => [0, 0, [0, 0], n, 0]);
  while (queue.length) {
    const [, energy, [cx, cy], ch, cs] = heap.pop(queue);
    if (cx === tx && cy === ty && condition(cs, cs)) {
      return energy;
    }
    DIR.map(([dx, dy], h) => [[cx + dx, cy + dy], h, h === ch ? cs + 1 : 1])
      .filter(([[x, y], h]) => grid[y]?.[x] && (h + 2) % 4 !== ch)
      .filter(([, , s]) => condition(cs, s))
      .map(([[x, y], h, s]) => [energy + grid[y][x], [x, y], h, s])
      .filter(
        ([e, [x, y], h, s]) =>
          (visited.get(hash(x, y, h, s)) ?? Infinity) > e &&
          visited.set(hash(x, y, h, s), e),
      )
      .forEach(([e, p, h, s]) =>
        heap.push(queue, [e + (tx - p[0]) + (ty - p[1]), e, p, h, s]),
      );
  }
};

const problem1 = (contents: string[]) => {
  const graph = contents.map((line) => line.split("").map(Number));
  return BFS((_, s) => s < 4)(graph);
};

const problem2 = (contents: string[]) => {
  const graph = contents.map((line) => line.split("").map(Number));
  return BFS((p, s) => (s > p || p >= 4) && s < 11)(graph);
};

export const results = {
  part1: problem1(input),
  part2: problem2(input),
};

export const testResults = {
  part1: problem1(test),
  part2: problem2(test),
};
