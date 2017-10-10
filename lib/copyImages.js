const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const copyFile = require('./copyFile').copyFile;

const copyImages = (images, entryPath, pathname, isIOS) => {
  console.log(chalk.blue(`Copying images to ${pathname}...`));
  images.forEach(image => {
    const ext = path.extname(image);
    const baseName = path.basename(image, ext);
    const newBase = baseName.replace(/\W+/g, '_').toLowerCase();
    const img = newBase.concat(ext).toLowerCase();
    if (!isIOS) {
      const filePath = path.join(entryPath, image);
      copyFile(filePath, `${pathname}/${img}`)
        .then(res => console.log(chalk.green(`File ${img} copied`)))
        .catch(err =>
          console.log(chalk.red(`Error copying file '${img}. ${err}`))
        );
    } else {
      // Copy images (iOS)
      // TODO: each file must be inside separate folder called like its name
      // TODO: need to create Contents.json file for each image
      const dirPath = path.join(__dirname, pathname, newBase);
      console.log(chalk.yellow(dirPath));
      fs.mkdir(dirPath, err => {
        if (!err || err.code === 'EEXIST') {
          copyFile(filePath, `${dirPath}/${img}`)
            .then(res => console.log(chalk.green(`File ${img} copied`)))
            .catch(err =>
              console.log(chalk.red(`Error copying file '${img}. ${err}`))
            );
        } else
          console.log(
            chalk.red(`Error creating ${dirPath} dir inside iOS path. ${err}`)
          );
      });
    }
  });
};

module.exports = {
  copyImages
};
