/* @flow */

/**
 * Moves files from specified directory to ios and android assets ones
 *
 * @param pathname Path to a folder containing images.
 */

const path = require('path');
const fs = require('fs');

const copyImages = require('./copyImages').copyImages;
const makeDir = require('./makeDir').makeDir;
const log = require('./log').log;

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

const makeImages = (pathname: string): Promise<boolean | string> =>
  new Promise((resolve, reject) => {
    const imagesAbsPath = path.join(process.cwd(), pathname);
    fs.readdir(imagesAbsPath, (err, files) => {
      if (err) {
        reject(`Could not access pathname. ${err.message}`);
        return;
      }
      const images = files.filter(file =>
        path.extname(file).match(/\.(jpg|jpeg|png|gif|bmp)$/i)
      );
      if (!images || !images.length) {
        reject('No images found. Aborting.');
        return;
      }
      const androidPath = path.join(
        process.cwd(),
        '/android/app/src/main/res/drawable'
      );
      makeDir(androidPath)
        .then(() => copyImages(images, imagesAbsPath, androidPath))
        .catch(e =>
          log(
            'red',
            `Error creating 'drawable' dir inside Android path. ${e.message}`
          )
        );
      const iosPath = getiosPath();
      makeDir(iosPath)
        .then(() => copyImages(images, imagesAbsPath, iosPath, true))
        .catch(e =>
          log(
            'red',
            `Error creating 'Images.xcassets' dir inside iOS path. ${e.message}`
          )
        );
      resolve(true);
    });
  });

exports.makeImages = makeImages;
