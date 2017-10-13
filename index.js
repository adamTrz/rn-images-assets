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

const makeImages = pathname => {
  if (!pathname) exit(`Please provide path to your images folder. Exiting.`);
  const imagesAbsPath = path.join(process.cwd(), pathname);
  const androidPath = path.join(
    process.cwd(),
    '/android/app/src/main/res/drawable'
  );
  const iosPath = getiosPath();
  fs.readdir(imagesAbsPath, (err, files) => {
    if (err) exit(`Could not access pathname. ${err}`);
    const images = files.filter(file =>
      path.extname(file).match(/\.(jpg|jpeg|png|gif|bmp)$/i)
    );
    if (!images || !images.length) {
      exit('No images found. Aborting.');
    }
    fs.mkdir(androidPath, err => {
      if (!err || err.code === 'EEXIST')
        copyImages(images, imagesAbsPath, androidPath);
      else
        log('red', `Error creating 'drawable' dir inside Android path. ${err}`);
    });
    fs.mkdir(iosPath, err => {
      if (!err || err.code === 'EEXIST')
        copyImages(images, imagesAbsPath, iosPath, true);
      else
        log('red', `Error creating 'drawable' dir inside Android path. ${err}`);
    });
  });
};

exports.makeImages = makeImages;
