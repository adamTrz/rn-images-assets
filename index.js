/**
* Moves files from specified directory to ios and androind assets ones
*
* @param pathname Path to a folder containing images.
*/
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');

const copyImages = require('./lib/copyImages').copyImages;

const colorLog = (color, msg) => console.log(chalk[color](msg));

const exit = msg => {
  console.log(chalk.red(msg));
  process.exit(1);
};

const makeImages = pathname => {
  const absPath = path.join(__dirname, pathname);
  const androidPath = path.join(
    __dirname,
    '/android/app/src/main/res/drawable'
  );
  // const iOsPAth = makeIOsPath();
  // access directory
  fs.readdir(absPath, (err, files) => {
    if (err) exit(`Could not acces pathname. ${err}`);
    // filter all images
    const images = files.filter(file =>
      path.extname(file).match(/.(jpg|jpeg|png|gif)$/i)
    );
    if (!images || !images.length) {
      exit('No images found. Aborting.');
    }
    // check if 'drawable' dir exists, if not, create one
    fs.mkdir(androidPath, err => {
      if (!err || err.code === 'EEXIST')
        copyImages(images, absPath, androidPath);
      else
        console.log(
          chalk.red(`Error creating 'drawable' dir inside android path. ${err}`)
        );
    });

    // Copy images (iOS)
    // TODO: newPath must contain projectName (eg. '/ios/PromoPage/Images.xcassets')
    // TODO: each file must be inside separate folder called like its name
    // TODO: need to create Contents.json file for each image
  });
};

exports.makeImages = makeImages;
