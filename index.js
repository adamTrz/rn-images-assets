/**
* Moves files from specified directory to ios and androind assets ones
*
* @param pathname Path to a folder containing images.
*/

const path = require('path');
const fs = require('fs');

const copyImages = require('./lib/copyImages').copyImages;
const log = require('./lib/log').log;

const exit = msg => {
  log('red', msg);
  process.exit(1);
};

const getiosPath = projectName => {
  // TODO: optional arg 'projectName' = to be accessed instead of 1st element?
  const ios = path.join(__dirname, 'ios');
  const iosContent = fs.readdirSync(ios);
  const iosPath = path.join(ios, iosContent[0], 'Images.xcassets');
  return iosPath;
};

const makeImages = (pathname, projectName) => {
  // console.log(process.argv);
  // TODO: optional arg 'projectName' = to be accessed instead of 1st element?
  if (!pathname) exit(`Please provide path to your images folder. Exiting.`);
  const absPath = path.join(__dirname, pathname);
  const androidPath = path.join(
    __dirname,
    '/android/app/src/main/res/drawable'
  );
  const iosPath = getiosPath(projectName);
  fs.readdir(absPath, (err, files) => {
    if (err) exit(`Could not access pathname. ${err}`);
    const images = files.filter(file =>
      path.extname(file).match(/.(jpg|jpeg|png|gif)$/i)
    );
    if (!images || !images.length) {
      exit('No images found. Aborting.');
    }
    fs.mkdir(androidPath, err => {
      if (!err || err.code === 'EEXIST')
        copyImages(images, absPath, androidPath);
      else
        log('red', `Error creating 'drawable' dir inside Android path. ${err}`);
    });
    fs.mkdir(iosPath, err => {
      if (!err || err.code === 'EEXIST')
        copyImages(images, absPath, iosPath, true);
      else
        log('red', `Error creating 'drawable' dir inside Android path. ${err}`);
    });
  });
};

exports.makeImages = makeImages;
