import { Command, Option } from "clipanion";

import { join } from "path";
import { existsSync } from "fs";

import { validateTime } from "../utils/actions";
import { FILENAMES } from "../utils/constants";

export class Test extends Command {
  static paths = [["test"]];

  static usage = Command.Usage({
    description: "Tests the current solution for a day.",
    examples: [
      ["Test the solution for the current day.", "pnpm run test"],
      ["Test the solution for a particular day.", "pnpm run test 2023/2"],
    ],
  });

  date = Option.String({ required: false });

  async execute() {
    const { year, day } = validateTime(this.date);

    const solutionFile = join("./", year, day, FILENAMES.SOLUTION_FILE);
    if (!existsSync(solutionFile))
      throw new Error(`The solution file does not exist for ${year}/${day}!`);

    const { testResults } = await import(solutionFile);
    this.context.stdout.write(JSON.stringify(testResults, undefined, 2));
  }
}
