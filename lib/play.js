import boxen from 'boxen';
import chalk from 'chalk';
import clear from 'clear';
import figlet from 'figlet';
import inquirer from 'inquirer';
import Table from 'cli-table3';
import textStyles from './output.js';
import { DiceRoller } from '@dice-roller/rpg-dice-roller';

const players = [];

/**
 * Prompt the user to confirm an action.
 * @param {string} message
 * @returns {Promise<boolean>}
 */
const confirmPrompt = (message) => {
  return inquirer
    .prompt({
      name: 'confirm',
      type: 'confirm',
      message: message,
    })
    .then((answers) => answers.confirm);
};

const drawBanner = () => {
  clear();
  console.log(chalk.yellow(figlet.textSync('Dice Roller')));
};

const outputRoll = (roll) => {
  console.log(boxen(chalk.cyan(`${roll}`), {padding: 1, margin: 1, borderStyle: 'round'}));
};

const playerCountPrompt = async () => {
  return inquirer.prompt({
    name: 'count',
    type: 'number',
    message: 'How many players are there?',
    default: 1,
    validate: (value) => {
      if ((typeof value === 'number') && (value > 0)) {
        return true;
      }

      return 'Please enter a positive whole number.';
    }
  });
};

/**
 * Prompts the user for a single name.
 *
 * @param {number} [number]
 * @returns {Promise<string>}
 */
const singleNamePrompt = async (number) => {
  return inquirer
    .prompt({
      name: 'name',
      type: 'input',
      message: `What is the name of ${chalk.yellow.italic(number ? `Player ${number}` : 'the Player')}`,
      default: number ? `Player ${number}` : 'Player',
      validate: (value) => {
        if (value.length) {
          return true;
        }

        return `Please enter the player's name`;
      }
    })
    .then((answers) => answers.name);
};

/**
 * Recursively prompts the user for a series of names up to the number of `count`.
 *
 * @param {number} [count=1] The total number of names required.
 * @param {number} [current=1] The current name number in the recursive loop.
 * @returns {Promise<string[]>}
 */
const namesPrompt = async (count = 1, current = 1) => {
  if (current === 0) {
    return Promise.reject();
  }

  return await singleNamePrompt(current)
    .then((name) => {
      const names = [name];

      if (current < count) {
        return namesPrompt(count, ++current)
          .then((answers) => {
            names.push(...answers);

            return names;
          })
          .catch(() => names);
      }

      return names;
    });
};

const setup = async () => {
  return playerCountPrompt()
    .then((answers) => namesPrompt(answers.count).then((names) => {
      players.push(...names.map((name) => {
        return {
          name,
        };
      }));

      return {
        players,
      };
    }));
};

/**
 * Prompt the user to select a player.
 * @returns {Promise<Object>}
 */
const choosePlayerPrompt = async () => {
  if (players.length === 1) {
    return Promise.resolve(players.find(Boolean));
  }

  return inquirer.prompt({
    name: 'player',
    type: 'list',
    message: `Who's turn is it?`,
    choices: players.map(({ name }, value) => {
      return {
        name,
        value,
      };
    }),
  }).then(({ player }) => players[player]);
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
    .then((answers) => answers.notation);
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
  const player = await choosePlayerPrompt();

  drawBanner();

  console.log(chalk.bold(`Ready ${player.name}, roll your dice! 🎲`), `\n`);

  notationPrompt()
    .then((notation) => {
      const roll = rollForPlayer(notation, player);

      outputRoll(roll);
    })
    .catch((reason) => {
      console.log(`\n`);
      console.error(chalk.bgRed('Error: Invalid notation'));
      console.error(textStyles.error(reason.message));
      console.log(`\n`);
    })
    .finally(() => {
      return confirmPrompt('Roll again?')
        .then((confirm) => {
          if (confirm) {
            run();
          } else {
            end();
          }
        });
    });
};

const end = async () => {
  drawBanner();

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

  console.log(chalk.bold('Game ended!'));
  console.log(`${table}`);

  process.exit(0);
};

export default async () => {
  drawBanner();

  await setup();

  drawBanner();

  console.log(chalk.bold(`🎲 Let's play!`), `\n`);

  await run();
};
