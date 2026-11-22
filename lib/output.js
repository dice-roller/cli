import chalk, { supportsColor } from 'chalk';
import { TerminalPresenter } from '@dice-roller/terminal-presenter';

export const createPresenter = (color, separator) => new TerminalPresenter({
  color: color ?? (Boolean(process.stdout.isTTY && supportsColor) && !process.env.NO_COLOR),
  separator,
});

const textStyles = {
  error: chalk.red.bold,
  success: chalk.greenBright.bold,
  warning: chalk.yellowBright.bold,
  info: chalk.blue.bold,
};

export default textStyles;
