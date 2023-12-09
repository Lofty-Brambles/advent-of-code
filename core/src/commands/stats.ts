import { Command, Option } from "clipanion";

import { validateYear } from "../utils/actions";

export class Stats extends Command {
  static paths = [["stats"]];

  static usage = Command.Usage({
    description: "Checks the stats for a year.",
    examples: [
      ["Check the stats for the current year.", "pnpm run stats"],
      ["Check the stats for a particular year.", "pnpm run stats 2023"],
      ["Check the stats for a private leaderboard", "pnpm run stats --private"],
    ],
  });

  year = Option.String({ required: false });
  checkPrivate = Option.Boolean("--private", false);

  async execute() {
    const year = validateYear(this.year);
    // TBD
  }
}
