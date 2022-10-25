#!/usr/bin/env node

import chalk from 'chalk';
import yargs from 'yargs/yargs';
import { DiceRoller, exportFormats, NumberGenerator } from '@dice-roller/rpg-dice-roller';

const textStyles = {
  error: chalk.red.bold,
  success: chalk.greenBright.bold,
  warning: chalk.yellowBright.bold,
};

const engines = NumberGenerator.engines;
const generator = NumberGenerator.generator;
const roller = new DiceRoller();

yargs()
  .scriptName('roller')
  .usage('$0 <notation..> [options]')
  .usage('$0 roll <notation..> [options]')
  .command({
    command: 'roll <notation..>',
    aliases: ['$0'],
    desc: 'roll the dice',
    builder: (yargs) => {
      yargs.positional('notation', {
        type: 'string',
        describe: 'space separated list of notation to roll',
      });
    },
    handler: (argv) => {
      if (argv.e) {
        if (!engines[argv.e]) {
          console.error(textStyles.error(`Error: Engine "${argv.e}" is invalid.`));
          process.exit(1);
        }

        if (argv.e === 'MersenneTwister19937') {
          if (argv.seed) {
            generator.engine = engines[argv.e].seed(argv.seed);
          } else {
            generator.engine = engines[argv.e].autoSeed();
          }
        } else {
          generator.engine = engines[argv.e];
        }
      }

      roller.roll(...argv.notation);

      if (argv.f in exportFormats) {
        console.log(roller.export(exportFormats[argv.f]));
      } else if (argv['result-only']) {
        console.log(roller.total);
      } else {
        console.log(`${roller.log.join(argv.s)}`);
      }
    },
  })
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
  .demandCommand()
  .help()
  //.argv;
  .parse(process.argv.slice(2));
