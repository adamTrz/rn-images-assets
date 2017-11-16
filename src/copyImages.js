/* @flow */
const fs = require('fs');
const path = require('path');

const copyFile = require('./copyFile').copyFile;
const makeDir = require('./makeDir').makeDir;
const log = require('./log').log;
const consents = require('./Contents.json');

const createJson = (pathname: string, imageName: string) => {
  const jsonPath = path.join(pathname, 'Contents.json');
  const replacer = (key, value) => (value === 'file' ? imageName : value);
  fs.writeFile(jsonPath, JSON.stringify(consents, replacer, 2), err => {
    if (err) log('red', `Error creating JSON file. ${err.message}`);
  });
};

const copyImage = (
  image: string,
  entryPath: string,
  pathname: string,
  isIOS?: boolean
) => {
  const ext = path.extname(image);
  const baseName = path.basename(image, ext);
  const newBase = baseName.replace(/\W+/g, '_').toLowerCase();
  const img = newBase.concat(ext).toLowerCase();
  const filePath = path.join(entryPath, image);
  if (!isIOS)
    return copyFile(filePath, `${pathname}/${img}`).then(() =>
      Promise.resolve(img)
    );
  const iosPath = path.join(pathname, `${newBase}.imageset`);
  return makeDir(iosPath)
    .then(() => {
      createJson(iosPath, img);
      return copyFile(filePath, `${iosPath}/${img}`).then(() =>
        Promise.resolve(img)
      );
    })
    .catch(e => Promise.reject(e));
};

const copyImages = (
  images: Array<string>,
  entryPath: string,
  pathname: string,
  isIOS?: boolean
) => {
  log('blue', `Copying images to ${pathname}...`);
  return Promise.all(
    images.map(image => copyImage(image, entryPath, pathname, isIOS))
  );
};

module.exports = {
  copyImages,
};
