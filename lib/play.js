import boxen from 'boxen';
import chalk from 'chalk';
import clear from 'clear';
import figlet from 'figlet';
import inquirer from 'inquirer';
import Table from 'cli-table3';
import textStyles from './output.js';
import { DiceRoller } from '@dice-roller/rpg-dice-roller';

const dieChar = '🎲';
const players = [];

/**
 * Prompt the user to confirm an action.
 * @param {string} message
 * @returns {Promise<boolean>}
 */
const confirmPrompt = async (message = 'Confirm') => {
  return inquirerabsility
    .prompt({
      name: 'confirm',
      type: 'confirm',
      message: message,
    })
    .then(({confirm}) => confirm);
};

const drawBanner = (text) => {
  clear();
  console.log(chalk.yellow(figlet.textSync(text)));
};

const drawLogo = () => {
  drawBanner(`Dice Roller ${dieChar}`);
};

const drawStats = () => {
  const table = new Table({
    head: ['Player', 'No. rolls', 'Total'],
  });

  table.push(...players.map((player) => {
    const roller = player.roller;

    return [
      player.name,
      roller?.log?.length || 0,
      roller?.total || 0,
    ];
  }));

  console.log(`${table}`);
};

const outputRoll = (roll, player) => {
  console.log(boxen(chalk.cyan(`${roll}`), {
    title: player?.name,
    titleAlignment: 'center',
    padding: 1,
    margin: 1,
    borderStyle: 'round'
  }));
};

const playerCountPrompt = async (answers = {}) => {
  return inquirer.prompt(
    {
      name: 'count',
      type: 'number',
      message: 'How many players are there?',
      default: 1,
      validate: (value) => {
        if ((typeof value === 'number') && (value > 0)) {
          return true;
        }

        return 'Please enter a positive whole number.';
      },
    },
    answers
  ).then(({count}) => count);
};

/**
 * Prompts the user for a series of names up to the number of `count`.
 *
 * @param {number} [count=1] The total number of names required.
 * @param {{}} [answers={}]
 * @returns {Promise<string[]>}
 */
const namePrompt = async (count = 1, answers = {}) => {
  // @todo see if we can use an array style prompt with a restriction on the length
  const options = [];
  const namesAnswers = {};

  for (let i = 1; i <= count; i++) {
    options.push({
      name: `name_${i}`,
      type: 'input',
      message: `What is the name of ${chalk.yellow.italic(i ? `Player ${i}` : 'the Player')}`,
      default: `Player ${i}`,
      validate: (value) => {
        if (value.length) {
          return true;
        }

        return `Please enter the player's name`;
      }
    });

    if (answers.players?.[i-1]) {
      namesAnswers[`name_${i}`] = answers.players?.[i-1];
    }
  }

  return inquirer.prompt(options, namesAnswers).then((names) => {
    return Object.values(names);
  });
};

/**
 * Prompt the user to select a player.
 * @returns {Promise<Object>}
 */
const chooseActionPrompt = async (answers = {}) => {
  const rollOptions = players.map((player) => {
    return {
      name: (players.length === 1) ? `${dieChar} Roll` : `${dieChar} Roll for ${player.name}`,
      value: player,
    };
  });

  return inquirer
    .prompt(
      [
        {
          name: 'action',
          type: 'list',
          message: `Action:`,
          choices: [
            ...rollOptions,
            new inquirer.Separator(),
            {
              name: 'View stats',
              value: 'stats',
            },
            {
              name: 'End game',
              value: 'end',
            }
          ],
        }
      ],
      answers
    ).then(({action}) => action);
};

/**
 * Prompt the user for the dice notation.
 * @returns {Promise<string>}
 */
const notationPrompt = async () => {
  return inquirer
    .prompt({
      name: 'notation',
      type: 'input',
      message: `Roll:`,
      validate: (value) => {
        if (value.length) {
          return true;
        }

        return `Please enter the die notation`;
      }
    })
    .then(({notation}) => notation);
};

const rollForPlayer = (notation, player) => {
  if (!player.roller) {
    player.roller = new DiceRoller();
  }

  return player.roller.roll(notation);
};

/**
 * Run the game.
 * @returns {Promise<void>}
 */
const run = async () => {
  // choose who's turn it is
  const action = await chooseActionPrompt();

  if (!action || (action === 'end')) {
    return confirmPrompt('Are you sure?').then((confirmed) => {
      if (confirmed) {
        end();
      } else {
        return run();
      }
    });
  } else if (action === 'stats') {
    drawLogo();
    drawStats();

    return run();
  } else if ((action === 'roll') || ((typeof action === 'object') && action.hasOwnProperty('name'))) {
    const player = (typeof action === 'object') ? action : players[0];

    drawLogo();

    console.log(chalk.bold(`Ready ${chalk.yellow.italic(player.name)}, roll your dice! ${dieChar}`), `\n`);

    return notationPrompt()
      .then((notation) => {
        const roll = rollForPlayer(notation, player);

        outputRoll(roll, player);
      })
      .catch((reason) => {
        console.log(`\n`);
        console.error(chalk.bgRed('Error: Invalid notation'));
        console.error(textStyles.error(reason.message));
        console.log(`\n`);
      })
      .finally(() => {
        return run();
      });
  } else {
    console.log('action:', action);
    console.error(textStyles.error('Action not recognised'));

    return run();
  }
};

const end = () => {
  drawBanner('Game Over!');

  drawStats();

  process.exit(0);
};

const setup = async (data = {}) => {
  return playerCountPrompt(data)
    .then((count) => {
      return namePrompt(count, data)
        .then((names) => {
          players
            .push(...names.map((name) => {
              return {
                name,
              };
            }));

          return {
            players,
          };
        });
    });
};

export default async (argv) => {
  const data = {
    count: Math.max(argv.count || 0, argv.players?.length || 0) || undefined,
    players: argv.players || undefined,
  };

  drawLogo();

  await setup(data);

  drawLogo();

  console.log(chalk.bold(`${dieChar} Let's play!`), `\n`);

  run();
};
