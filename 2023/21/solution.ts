import { readFile } from "fs/promises";

const rawTest = `...........
.....###.#.
.###.##..#.
..#.#...#..
....#.#....
.##..S####.
.##..#...#.
.......##..
.##.#.####.
.##..##.##.
...........`;

const inputFilePath = new URL("./input.txt", import.meta.url);
const rawInput = await readFile(inputFilePath, { encoding: "utf-8" });
const input = rawInput.trim().split("\n");
const test = rawTest.trim().split("\n");

type Coords = [number, number];
const parsePlot = (lines: string[]) => {
  let start: Coords = [0, 0];
  const plot = lines.map((line, row) => {
    if (!line.includes("S")) return line.split("");
    start = [row, line.indexOf("S")];
    return line.replace("S", ".").split("");
  });
  return { plot, start };
};

const hashCoords = (coords: Coords[]) => coords.map((coord) => `${coord}`);
const unHashCoords = (strings: string[]) =>
  strings.map((string) => string.split(",").map(Number) as Coords);

const findPlot = (map: string[][], start: Coords, steps: number) => {
  const MAX = [map.length, map[0].length];
  const inBounds = (coord: Coords) =>
    [0, 1].every((i) => coord[i] >= 0 && coord[i] < MAX[i]);
  const isPath = (coord: Coords) => map[coord[0]][coord[1]] === ".";
  const isPathInbound = (coord: Coords) => isPath(coord) && inBounds(coord);

  // prettier-ignore
  const SHIFTS: Coords[] = [[1, 0], [0, 1], [-1, 0], [0, -1]];
  const addCoords = (coord1: Coords, coord2: Coords) =>
    [0, 1].map((i) => coord1[i] + coord2[i]) as Coords;

  let positions: Coords[] = [start];
  for (let step = 1; step <= steps; step++) {
    const newPositions: Coords[] = [];
    const addTo = (coord: Coords) =>
      SHIFTS.map((ds) => addCoords(ds, coord)).filter(isPathInbound);
    positions.forEach((position) => newPositions.push(...addTo(position)));
    positions = unHashCoords([...new Set(hashCoords(newPositions))]);
  }
  return positions.length;
};

const problem1 = (contents: string[]) => {
  const { plot, start } = parsePlot(contents);
  return findPlot(plot, start, 6);
};

const problem2 = (contents: string[]) => {
  const { plot, start } = parsePlot(contents);
  const gardenGridDiameter = ~~(steps / mapWidth) - 1;

  const oddGardens = (~~(gardenGridDiameter / 2) * 2 + 1) ** 2;
  const evenGardens = (~~((gardenGridDiameter + 1) / 2) * 2) ** 2;

  const oddGardenPlots = findPlots(map, startX, startY, mapWidth * 2 + 1);
  const evenGardenPlots = findPlots(map, startX, startY, mapWidth * 2);

  const northPlots = findPlots(map, startX, mapWidth - 1, mapWidth - 1);
  const eastPlots = findPlots(map, 0, startY, mapWidth - 1);
  const southPlots = findPlots(map, startX, 0, mapWidth - 1);
  const westPlots = findPlots(map, mapWidth - 1, startY, mapWidth - 1);

  const smallSteps = ~~(mapWidth / 2) - 1;

  const NEPlotsSM = findPlots(map, 0, mapWidth - 1, smallSteps);
  const NWPlotsSM = findPlots(map, mapWidth - 1, mapWidth - 1, smallSteps);
  const SEPlotsSM = findPlots(map, 0, 0, smallSteps);
  const SWPlotsSM = findPlots(map, mapWidth - 1, 0, smallSteps);

  const largeSteps = ~~((mapWidth * 3) / 2) - 1;

  const NEPlotsLG = findPlots(map, 0, mapWidth - 1, largeSteps);
  const NWPlotsLG = findPlots(map, mapWidth - 1, mapWidth - 1, largeSteps);
  const SEPlotsLG = findPlots(map, 0, 0, largeSteps);
  const SWPlotsLG = findPlots(map, mapWidth - 1, 0, largeSteps);

  // console.log({ SEPlotsSM, SWPlotsSM, NWPlotsSM, NEPlotsSM });
  // console.log({ SEPlotsLG, SWPlotsLG, NWPlotsLG, NEPlotsLG });
  // console.log({ oddGardenPlots, evenGardenPlots });

  const mainGardenPlots =
    oddGardens * oddGardenPlots + evenGardens * evenGardenPlots;

  const smallSidePlots =
    (gardenGridDiameter + 1) * (SEPlotsSM + SWPlotsSM + NWPlotsSM + NEPlotsSM);

  const largeSidePlots =
    gardenGridDiameter * (SEPlotsLG + SWPlotsLG + NWPlotsLG + NEPlotsLG);
  return undefined;
};

export const results = {
  part1: problem1(input),
  part2: problem2(input),
};

// export const testResults = {
//   part1: problem1(test),
//   part2: problem2(test),
// };
