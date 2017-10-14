/* @flow */
/**
* Moves files from specified directory to ios and androind assets ones
*
* @param pathname Path to a folder containing images.
*/

const path = require('path');
const fs = require('fs');

const copyImages = require('./copyImages').copyImages;
const log = require('./log').log;

const exit = msg => {
  log('red', msg);
  process.exit(1);
};

const getiosPath = () => {
  const pathname = process.cwd();
  const projectName = pathname.split('/').pop();
  const iosPath = path.join(
    process.cwd(),
    'ios',
    projectName,
    'Images.xcassets'
  );
  return iosPath;
};

const makeImages = (pathname: string) => {
  if (!pathname) exit(`Please provide path to your images folder. Exiting.`);
  const imagesAbsPath = path.join(process.cwd(), pathname);
  const androidPath = path.join(
    process.cwd(),
    '/android/app/src/main/res/drawable'
  );
  const iosPath = getiosPath();
  fs.readdir(imagesAbsPath, (err, files) => {
    if (err) exit(`Could not access pathname. ${err.message}`);
    const images = files.filter(file =>
      path.extname(file).match(/\.(jpg|jpeg|png|gif|bmp)$/i)
    );
    if (!images || !images.length) {
      exit('No images found. Aborting.');
    }
    fs.mkdir(androidPath, 0o777, e => {
      if (!e || e.code === 'EEXIST')
        copyImages(images, imagesAbsPath, androidPath);
      else
        log(
          'red',
          `Error creating 'drawable' dir inside Android path.
          ${e.message}`
        );
    });
    fs.mkdir(iosPath, 0o777, error => {
      if (!error || error.code === 'EEXIST')
        copyImages(images, imagesAbsPath, iosPath, true);
      else
        log(
          'red',
          `Error creating 'Images.xcassets' dir inside iOS path.
          ${error.message}`
        );
    });
  });
};

exports.makeImages = makeImages;
