/* @flow */
/* eslint no-console: 0 */

const chalk = require('chalk');

const log = (color: string, message: string) =>
  console.log(chalk[color](message));

module.exports = {
  log,
};
