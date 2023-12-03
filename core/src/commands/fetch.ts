import { Command, Option } from "clipanion";
import TurndownService from "turndown";

import { mkdir } from "fs/promises";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { existsSync } from "fs";

import {
  ARTICLE_REGEX,
  CONFIG_FILE,
  INPUT_FILE,
  LANGUAGE_FILE,
  QUESTION_FILE,
  SOLUTION_FILE,
} from "../utils/constants";
import { Actions } from "../utils/actions";

const __dirname = dirname(fileURLToPath(import.meta.url));
const __root = join(__dirname, "..", "..", "..");
const __templates = join(__root, "core", "templates");

export class Fetch extends Command {
  static paths = [["fetch"]];

  static usage = Command.Usage({
    description: "Fetches the details for a day.",
    examples: [
      ["Fetch the question for the current day.", "pnpm run fetch"],
      ["Fetch the question for a day in this year.", "pnpm run fetch --day 2"],
      [
        "Fetch the question for another year",
        "pnpm run fetch --year 2022 --day 2",
      ],
    ],
  });

  year = Option.String("--year");
  day = Option.String("--day");

  async execute() {
    this.context.stdout.write("- Creating...\n\n");
    const year = `${this.year ?? new Date().getFullYear()}`;
    const rawDay = `${this.day ?? new Date().getDate()}`;
    const day = rawDay.padStart(2, "0");

    const srcDir = join(__root, year, day);
    if (!existsSync(srcDir)) await mkdir(srcDir);

    const inputFile = join(srcDir, INPUT_FILE);
    if (!existsSync(inputFile)) {
      const data = await fetchData(year, rawDay);
      await Actions.write(inputFile, data);
    }

    const solutionFile = join(srcDir, SOLUTION_FILE);
    if (!existsSync(solutionFile)) {
      const language = await Actions.read(join(srcDir, "..", LANGUAGE_FILE));
      const solutionTmplFile = join(__templates, language, SOLUTION_FILE);
      await Actions.copy(solutionTmplFile, solutionFile);
    }

    const questionFile = join(srcDir, QUESTION_FILE);
    if (!existsSync(questionFile)) {
      const questionHTML = await fetchQuestion(year, rawDay);
      await Actions.write(questionFile, processQuestion(questionHTML));
    }
  }

  async catch(error: unknown) {
    this.context.stdout.write("\n- Aborting...\n");
    throw error;
  }
}

const fetchData = async (year: string, day: string) => {
  const authCookie = await Actions.read(join(__root, year, CONFIG_FILE));
  const inputURL = `https://adventofcode.com/${year}/day/${day}/input`;

  const res = await fetch(inputURL, { headers: { cookie: authCookie } });

  if (res.status === 200) return res.text();
  if (res.status === 404) throw new Error("Error 404 - puzzle not found.");
  throw new Error(
    "The puzzle wasn't found - please try again after resetting the session token."
  );
};

const fetchQuestion = async (year: string, day: string) => {
  const inputURL = `https://adventofcode.com/${year}/day/${day}`;
  const res = await fetch(inputURL);

  if (res.status === 200) return res.text();
  if (res.status === 404) throw new Error("Error 404 - question not found.");
  throw new Error(
    "The question wasn't found - please try again after resetting the session token."
  );
};

const processQuestion = (contents: string) => {
  const questionInHtml = contents.match(ARTICLE_REGEX)![0];
  const turndown = new TurndownService();
  return `---------------------------
# ${turndown.turndown(questionInHtml).slice(1)}`;
};
