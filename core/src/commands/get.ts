import { Command, Option } from "clipanion";
import TurndownService from "turndown";
import kfs from "key-file-storage";
import prompts from "prompts";

import { join } from "path";
import { existsSync } from "fs";
import { cp, mkdir, writeFile } from "fs/promises";

import { ARTICLE_REGEX, FILENAMES } from "../utils/constants";
import { validateTime } from "../utils/actions";

export class Get extends Command {
  static paths = [["get"]];

  static usage = Command.Usage({
    description: "Fetches the details for a day.",
    examples: [
      ["Fetch the question for the current day.", "pnpm run fetch"],
      ["Fetch the question for a particular day.", "pnpm run fetch 2023/2"],
    ],
  });

  date = Option.String({ required: false });

  async execute() {
    const { year, day, rawDay } = validateTime(this.date);
    const store = kfs("./");

    const yearPath = join("./", year);
    const dayPath = join("./", year, day);

    if (!existsSync(yearPath)) {
      await mkdir(yearPath);
      const setup: Record<string, string> = await prompts(questions);
      store(year, setup);
    }

    if (existsSync(dayPath))
      throw new Error("The day's problem already exists.");

    const rawQuestionText = await getQuestion(year, rawDay);
    const question = processQuestion(rawQuestionText);
    await writeFile(join(dayPath, FILENAMES.PROMPT_FILE), question);

    const configForYear = await store(year);
    const input = await getInput(year, rawDay, configForYear.session);
    await writeFile(join(dayPath, FILENAMES.INPUT_FILE), input);

    const fromTemplate = join("./core/templates", configForYear.language);
    const toTemplate = join(dayPath, FILENAMES.SOLUTION_FILE);
    await cp(fromTemplate, toTemplate);

    this.context.stdout.write(`[ x ] Done! Your question is at ${year}/${day}`);
  }
}

const questions: prompts.PromptObject[] = [
  {
    type: "select",
    name: "language",
    message: "Pick your language",
    choices: [
      { title: "TypeScript", value: "ts" },
      { title: "JavaScript", value: "js" },
    ],
    initial: 0,
  },
  {
    type: "password",
    name: "session",
    message: `Enter your session key - to get your session key
  - After logging into the Advent of Code website, go to the Networks tab.
  - Hit Refresh and check out the request of the HTML page.
  - You should notice a cookie named "session=" followed by a long string and ending with a semi-colon.
  - This long string after "session=" and before ";" is your session key.
`,
  },
];

const getQuestion = async (year: string, rawDay: string) => {
  const URL = `https://adventofcode.com/${year}/day/${rawDay}`;
  const response = await fetch(URL);
  const responseText = await response.text();

  if (response.status === 200) return responseText;
  if (response.status === 404 && responseText.includes("before it unlocks!"))
    throw new Error(`[ * ] | This puzzle has not unlocked yet.
        It will unlock on Dec ${rawDay}, ${year} at midnight EST (UTC-5).`);

  throw new Error("The question wasn't found - please try again.");
};

const getInput = async (year: string, rawDay: string, key: string) => {
  const URL = `https://adventofcode.com/${year}/day/${rawDay}/input`;
  const response = await fetch(URL, { headers: { cookie: `session=${key}` } });

  if (response.status === 200) return response.text();
  throw new Error("The puzzle wasn't found - please check your session token.");
};

const processQuestion = (contents: string) => {
  const questionInHtml = contents.match(ARTICLE_REGEX)![0];
  const turndown = new TurndownService();
  return `---------------------------
# ${turndown.turndown(questionInHtml).slice(1)}`;
};
