import { Command, Option } from "clipanion";
import keyFileStorage from "key-file-storage";

import { join } from "path";
import { existsSync } from "fs";
import { writeFile } from "fs/promises";

import { getQuestion, processQuestion, validateTime } from "../utils/actions";
import { FILENAMES } from "../utils/constants";

export class Submit extends Command {
  static paths = [["submit"]];

  static usage = Command.Usage({
    description: "Submits the solution for a day.",
    examples: [
      ["Submits the solution for the current day.", "pnpm run submit"],
      ["Submits the solution for a particular day.", "pnpm run submit 2023/2"],
    ],
  });

  date = Option.String({ required: false });

  async execute() {
    const { year, day, rawDay } = validateTime(this.date);
    const store = keyFileStorage("./");
    const config = await store(year);

    const dayPath = join("./", year, day);
    const solutionFile = join(dayPath, FILENAMES.SOLUTION_FILE);
    if (!existsSync(solutionFile))
      throw new Error(`The solution file does not exist for ${year}/${day}!`);

    const { results } = await import(solutionFile);

    let resp: FullResponseType;
    if (results.part2 !== undefined)
      resp = await sendCheck(year, rawDay, 2, results.part2, config.session);
    else if (results.part1 !== undefined)
      resp = await sendCheck(year, rawDay, 1, results.part1, config.session);
    else {
      this.context.stdout.write("[ o ] No solutions have been implemented!");
      return;
    }

    if (resp.status === "FAIL")
      this.context.stdout.write(`The part ${resp.level} solution is wrong.`);
    else if (resp.status === "RATE_LIMIT")
      this.context.stdout.write("You are trying to submit too often!");
    else if (resp.status === "NOT_LOGGED")
      this.context.stdout.write("Your session token has expired.");
    else if (resp.status === "COMPLETE")
      this.context.stdout.write("You have already completed this question.");
    else if (resp.status === "UNKNOWN")
      throw new Error(`Something went wrong. Please see below.
${resp.response}`);
    else {
      if (resp.level === 2) {
        this.context.stdout.write(`Day ${year}/${day} completed! ⭐⭐`);
        return;
      }

      const rawQuestionText = await getQuestion(year, rawDay);
      const question = processQuestion(rawQuestionText);
      await writeFile(join(dayPath, FILENAMES.PROMPT_FILE), question);
      this.context.stdout.write(`Part 1 of day ${year}/${day} is complete! ⭐`);
    }
  }
}

type ResponseType =
  | "PASS"
  | "FAIL"
  | "RATE_LIMIT"
  | "COMPLETE"
  | "NOT_LOGGED"
  | "UNKNOWN";
type FullResponseType = {
  status: ResponseType;
  response: string;
  level: 1 | 2;
};

const sendCheck = async (
  year: string,
  day: string,
  level: 1 | 2,
  answer: string | number,
  key: string
): Promise<FullResponseType> => {
  const URL = `https://adventofcode.com/${year}/day/${day}/answer`;
  const requestDetails = {
    method: "POST",
    body: `level=${level}&answer=${answer}`,
    headers: {
      cookie: key,
      "content-type": "application/x-www-form-urlencoded",
    },
  };

  const result = await fetch(URL, requestDetails);
  if (result.status !== 200) throw new Error(String(result.status));
  const responseText = await result.text();
  return { status: findResult(responseText), response: responseText, level };
};

const findResult = (text: string) => {
  if (text.includes("That's the right answer")) return "PASS";
  if (text.includes("That's not the right answer")) return "FAIL";
  if (text.includes("You gave an answer too recently")) return "RATE_LIMIT";
  if (text.includes("Did you already complete it?")) return "COMPLETE";
  if (text.includes("[Log In]")) return "NOT_LOGGED";
  return "UNKNOWN";
};
