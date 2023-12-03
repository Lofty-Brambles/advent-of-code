import { Command } from "clipanion";
import prompts from "prompts";

import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { existsSync } from "fs";
import { mkdir } from "fs/promises";

import { CONFIG_FILE, LANGUAGE_FILE, YEARS } from "../utils/constants";
import { Actions } from "../utils/actions";

const __dirname = dirname(fileURLToPath(import.meta.url));
const __root = join(__dirname, "..", "..", "..");

export class Init extends Command {
  static paths = [["init"]];

  static usage = Command.Usage({
    description: "Initializes for a folder for a year.",
  });

  async execute() {
    this.context.stdout.write("- Creating...\n\n");
    const setup = await prompts(questions, { onCancel: this.catch });

    const srcDir = join(__root, `${setup.year}`);
    if (existsSync(srcDir)) {
      const existsMsg = "\n- Aborting: The directory for that year exists\n";
      this.context.stdout.write(existsMsg);
      return;
    }

    await mkdir(srcDir);

    await Actions.write(join(srcDir, LANGUAGE_FILE), `${setup.language}`);

    await Actions.write(join(srcDir, CONFIG_FILE), `session=`);

    this.context.stdout.write(
      `
* [x] Done! Now,
  - After logging into the Advent of Code website, go to the Networks tab.
  - Hit Refresh and check out the request of the HTML page.
  - You should notice a cookie named "session=" followed by a long string and ending with a semi-colon.
  - Copy this long string after "session=" and before ";".
  - Go to the project's directory (named after the year selected).
  - In the file named ".config" paste this string beside the empty key, "session=".
  - If you haven't logged in, run "pnpm run login". 
  - Otherwise, generate your question with "pnpm run fetch".
  - Good luck!
`
    );
  }

  async catch(error: unknown) {
    this.context.stdout.write("\n- Aborting...\n");
    throw error;
  }
}

const questions: prompts.PromptObject[] = [
  {
    type: "select",
    name: "year",
    message: "Pick a year",
    choices: YEARS.map((year) => ({ title: `${year}`, value: year })),
    initial: 0,
  },
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
];
