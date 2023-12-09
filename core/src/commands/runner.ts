import { Command, Option } from "clipanion";

import { dirname, join } from "path";
import { fileURLToPath } from "url";

import {
  ARTICLE_REGEX,
  CACHE_FILE,
  CONFIG_FILE,
  SOLUTION_FILE,
} from "../utils/constants";
import { Actions } from "../utils/actions";

const __dirname = dirname(fileURLToPath(import.meta.url));
const __root = join(__dirname, "..", "..", "..");

export class Runner extends Command {
  static paths = [["runner"]];

  static usage = Command.Usage({
    description: "Checks solution for a day.",
    examples: [
      ["Checks solution for the current day.", "pnpm run fetch"],
      ["Checks solution for a day in this year.", "pnpm run fetch --day 2"],
      [
        "Checks solution for another year",
        "pnpm run fetch --year 2022 --day 2",
      ],
    ],
  });

  year = Option.String("--year");
  day = Option.String("--day");

  async execute() {
    const year = `${this.year ?? new Date().getFullYear()}`;
    const rawDay = `${this.day ?? new Date().getDate()}`;
    const day = rawDay.padStart(2, "0");

    const initialMsg = `- Checking the solution for ${year}/${day}...`;
    this.context.stdout.write(initialMsg + "\n\n");

    const solutionFile = join(__root, year, day, SOLUTION_FILE);
    const { results }: { results: ResultObject } = await import(solutionFile);

    const cachePath = join(__root, year, CACHE_FILE);
    const cache = await cacheFx.load(cachePath);

    // if (
    //   results.part1 === undefined ||
    //   cache[`${day}`].part1.includes(`${results.part1}`)
    // ) {
    //   this.context.stdout.write("* [x] The answer to part 1 is wrong!");
    //   return;
    // }

    // const answerBody = `level=1&answer=${results.part1}`;
    // const response = await sendCheckRequest(year, rawDay, answerBody);
    // const answerInHtml = response.match(ARTICLE_REGEX)![0];
    // const result = getResult(answerInHtml);
  }
}

type Result = number | string | undefined;
type ResultObject = {
  part1: Result;
  part2: Result;
};

const cacheFx = {
  load: async (cachePath: string) => {
    const dataString = await Actions.read(cachePath);
    return JSON.parse(dataString) as CacheType;
  },
  set: async (cachePath: string, cache: CacheType) => {
    await Actions.write(cachePath, cache);
  },
};

type CacheType = {
  [day: string]: {
    part1: string[];
    part2: string[];
  };
};

const sendCheckRequest = async (year: string, day: string, body: string) => {
  const URL = `https://adventofcode.com/${year}/day/${day}/answer`;
  const authCookie = await Actions.read(join(__root, year, CONFIG_FILE));
  const requestDtls = {
    method: "POST",
    body: body,
    headers: {
      cookie: authCookie,
      "content-type": "application/x-www-form-urlencoded",
    },
  };

  const result = await fetch(URL, requestDtls);
  if (result.status !== 200) throw new Error(String(result.status));
  return result.text();
};

const getResult = (response: string) => {
  if (response.includes("That's the right answer")) {
    return "success";
  } else if (response.includes("That's not the right answer")) {
    return "failure";
  } else if (response.includes("You gave an answer too recently")) {
    return "too soon";
  } else if (
    response.includes("You don't seem to be solving the right level")
  ) {
    return "wrong level";
  } else {
    throw new Error("Unknown response.\n" + response);
  }
};
