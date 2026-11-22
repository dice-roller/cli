#!/usr/bin/env node

import { EXPORT_FORMATS, Roller } from '@dice-roller/rpg-dice-roller';
import { createPresenter } from './output.js';

export default (argv) => {
  const engine = argv.engine ? {name: argv.engine, seed: argv.seed} : undefined;
  const presenter = createPresenter(argv.color, argv.separator);
  const roller = new Roller({engine, presenter});

  for (const notation of argv.notation) {
    roller.roll(notation);
  }

  const format = argv.format.toLowerCase().replace('base_64', 'base64');
  if (format === 'object') {
    console.dir(roller.export(format), {colors: false});
  } else if (EXPORT_FORMATS.includes(format)) {
    console.log(roller.export(format));
  } else if (argv['result-only']) {
    console.log(roller.history.total);
  } else {
    console.log(roller.present());
  }
};
