#!/usr/bin/env node

import yargs from 'yargs/yargs';
import Play from './lib/play.js';
import Roller from './lib/roll.js';
import textStyles from './lib/output.js';

const cli = yargs()
  .scriptName('roller')
  .usage('$0 <notation..> [options]')
  .example('$0 4d6', 'roll a 6 sided die 4 times')
  .example('$0 2d10+7', 'roll a 10 sided die 2 times and add 7')
  .example('$0 play', 'start the interactive CLI dice game')
  .command({
    command: '$0 <notation..>',
    aliases: ['roll'],
    desc: 'roll the dice',
    builder: (yargs) => {
      yargs.positional('notation', {
        type: 'string',
        describe: 'space separated list of notation to roll',
      });

      yargs
        .options({
          's': {
            alias: 'separator',
            demandOption: false,
            default: '; ',
            describe: 'String to separate dice rolls',
            type: 'string',
          },
          'e': {
            alias: 'engine',
            demandOption: false,
            describe: 'The RNG engine to use',
            type: 'string',
          },
          'seed': {
            demandOption: false,
            describe: 'The RNG engine seed',
            type: 'number',
          },
          'f': {
            alias: 'format',
            demandOption: false,
            describe: 'The output format',
            type: 'string',
            default: 'string',
          },
          'result-only': {
            demandOption: false,
            description: 'Only return the roll result, without the notation or dice rolled',
            type: 'boolean',
            default: false,
          },
        })
    },
    handler: Roller,
  })
  .command({
    command: 'play',
    desc: 'play an interactive CLI dice game',
    builder: (yargs) => {
      yargs
        .options({
          'players': {
            describe: 'The name of a player',
            type: 'array',
          },
          count: {
            describe: 'The number of players',
            type: 'number',
          },
        })
        .epilog('For more information visit https://dice-roller.github.io/documentation');
    },
    handler: Play,
  })
  .option('color', {
    type: 'boolean',
    describe: 'Enable colour in roll output (use --no-color to disable it)',
  })
  .demandCommand()
  .epilog('For more information visit https://dice-roller.github.io/documentation')
  .help()
  .alias('version', 'V')
  .strict();

try {
  await cli.parseAsync(process.argv.slice(2));
} catch (error) {
  console.error(textStyles.error(`Error: ${error.message}`));
  process.exitCode = 1;
}
