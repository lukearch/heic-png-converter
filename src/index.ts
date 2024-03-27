#!/usr/bin/env node

import { Command } from 'commander';
import convertAllCommand from './commands/convert-all';

const run = async () => {
  const pkgJson = await import('../package.json');

  const program = new Command()
    .version(pkgJson.version)
    .description(pkgJson.description)
    .addCommand(convertAllCommand);

  program.parse(process.argv);
};

run();
