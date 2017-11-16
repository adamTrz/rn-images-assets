/* @flow */
const fs = require('fs');
const path = require('path');

const copyFile = require('./copyFile').copyFile;
const log = require('./log').log;
const consents = require('./Contents.json');

const createJson = (pathname: string, imageName: string) => {
  const jsonPath = path.join(pathname, 'Contents.json');
  const replacer = (key, value) => (value === 'file' ? imageName : value);
  fs.writeFile(jsonPath, JSON.stringify(consents, replacer, 2), err => {
    if (err) log('red', `Error creating JSON file. ${err.message}`);
  });
};

const copyImages = (
  images: Array<string>,
  entryPath: string,
  pathname: string,
  isIOS?: boolean
) => {
  log('blue', `Copying images to ${pathname}...`);
  images.forEach(image => {
    const ext = path.extname(image);
    const baseName = path.basename(image, ext);
    const newBase = baseName.replace(/\W+/g, '_').toLowerCase();
    const img = newBase.concat(ext).toLowerCase();
    const filePath = path.join(entryPath, image);
    if (!isIOS) {
      copyFile(filePath, `${pathname}/${img}`)
        .then(() => log('green', `File ${img} copied to 'drawable' directory.`))
        .catch(err => log('red', `Error copying file '${img}. ${err}`));
    } else {
      const dirPath = path.join(pathname, `${newBase}.imageset`);
      fs.mkdir(dirPath, 0o777, err => {
        if (!err || err.code === 'EEXIST') {
          createJson(dirPath, img);
          copyFile(filePath, `${dirPath}/${img}`)
            .then(() =>
              log(
                'green',
                `File ${img} copied to 'Images.xcassets/${
                  newBase
                }.imageset' directory.`
              )
            )
            .catch(e => log('red', `Error copying file '${img}. ${e.message}`));
        } else
          log(
            'red',
            `Error creating ${dirPath} dir inside iOS path. ${err.message}`
          );
      });
    }
  });
};

module.exports = {
  copyImages,
};
