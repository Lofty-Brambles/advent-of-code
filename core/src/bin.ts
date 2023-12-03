#!/usr/bin/env node
import { runExit } from "clipanion";

import { Init } from "./commands/init";
import { Fetch } from "./commands/fetch";

runExit([Init, Fetch]);
