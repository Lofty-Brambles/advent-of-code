import { Command, Option } from "clipanion";

export class StartCommand extends Command {
  static paths = [["start"]];

  language = Option.String();

  day = ""

  async execute(): Promise<number | void> {
    this.context.stdout.write(`hello`);
  }
}
