const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const copyFile = require('./copyFile').copyFile;

const copyImages = (images, entryPath, pathname, isIOS) => {
  console.log(chalk.blue(`Copying images to ${pathname}...`));
  images.forEach(img => {
    const filePath = path.join(entryPath, img);
    copyFile(filePath, `${pathname}/${img}`)
      .then(res => console.log(chalk.green(`File ${img} copied`)))
      .catch(err =>
        console.log(chalk.red(`Error copying file '${img}. ${err}`))
      );
  });
};

module.exports = {
  copyImages
};
