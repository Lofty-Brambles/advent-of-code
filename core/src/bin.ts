#!/usr/bin/env node
import { Cli, Builtins, type CommandClass } from "clipanion";

import { Get } from "./commands/get";
import { Test } from "./commands/test";
import { Submit } from "./commands/submit";

const commands: CommandClass[] = [
  Builtins.VersionCommand,
  Builtins.HelpCommand,
  Get,
  Test,
  Submit,
  // Stats,
];

const [node, app, ...args] = process.argv;

const binaryLabel = "Advent of CLI";
const binaryName = `${node} ${app}`;
const binaryVersion = "1.0.0";

const cli = new Cli({ binaryLabel, binaryName, binaryVersion });
commands.forEach((command) => cli.register(command));
cli.runExit(args);
