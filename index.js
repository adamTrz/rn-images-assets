/**
* Moves files from specified directory to ios and androind assets ones
*
* @param pathname Path to a folder containing images.
*/
const path = require('path');
const fs = require('fs');

const exit = msg => {
  console.log(msg);
  process.exit(1);
};

const copyFile = (source, target) => {
  return new Promise((resolve, reject) => {
    const rd = fs.createReadStream(source);
    rd.on('error', err => reject(err));
    const wr = fs.createWriteStream(target);
    wr.on('error', err => reject(err));
    wr.on('close', () => resolve());
    rd.pipe(wr);
  });
};

const makeImages = pathname => {
  const absPath = path.join(__dirname, pathname);
  const androidPath = path.join(
    __dirname,
    '/android/app/src/main/res/drawable'
  );
  // const iOsPAth = makeIOsPath()
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
    // check if android dir exists, if not, create one
    fs.mkdir(androidPath, err => {
      if (err) {
        if (err.code === 'EEXIST')
          console.log('Android path exists. Copying...');
        else
          console.error(
            `Error creating 'drawable' dir iside android path. ${err}`
          );
      } else console.log('Created Android path.');
    });
    // Move images (Android)
    images.forEach(img => {
      const filePath = path.join(absPath, img);
      copyFile(filePath, `${androidPath}/${img}`)
        .then(res => console.log(`File ${img} copied`))
        .catch(err => console.error(`Error copying file '${img}. ${err}`));
    });
    // Move images (iOS)
    // TODO: newPath must contain projectName (eg. '/ios/PromoPage/Images.xcassets')
    // TODO: each file must be inside separate folder called like its name
    // TODO: need to create Contents.json file for each image
  });
};

exports.makeImages = makeImages;
