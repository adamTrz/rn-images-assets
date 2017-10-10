/**
* Moves files from specified directory to ios and androind assets ones
*
* @param pathname Path to a folder containing images.
*/
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');

const copyImages = require('./lib/copyImages').copyImages;

const exit = msg => {
  console.log(chalk.red(msg));
  process.exit(1);
};

const makeIOsPath = projectName => {
  // TODO: optional arg 'projectName' = to be accessed instead of 1st element?
  const ios = path.join(__dirname, 'ios');
  const iosContent = fs.readdirSync(ios);
  const iosPath = path.join(__dirname, iosContent[0], 'Images.xcassets');
  return iosPath;
};

const makeImages = pathname => {
  // console.log(process.argv);
  if (!pathname) exit(`Please provide path to your images folder. Exiting.`);
  const absPath = path.join(__dirname, pathname);
  const androidPath = path.join(
    __dirname,
    '/android/app/src/main/res/drawable'
  );
  const iosPath = makeIOsPath();
  console.log('iosPath: ', iosPath);
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
          chalk.red(`Error creating 'drawable' dir inside Android path. ${err}`)
        );
    });
    copyImages(images, absPath, iosPath, true);
  });
};

exports.makeImages = makeImages;
