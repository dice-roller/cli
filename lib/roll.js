#!/usr/bin/env node

import { DiceRoller, exportFormats, NumberGenerator } from '@dice-roller/rpg-dice-roller';
import textStyles from './output.js';

const engines = NumberGenerator.engines;
const generator = NumberGenerator.generator;
const roller = new DiceRoller();

export default (argv) => {
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
};
