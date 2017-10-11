const chalk = require('chalk');

const log = (color, message) => {
  console.log(chalk[color](message));
};

module.exports = {
  log
};