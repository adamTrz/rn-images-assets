/* @flow */
const fs = require('fs');

const copyFile = (source: string, target: string): Promise<*> =>
  new Promise((resolve, reject) => {
    const rd = fs.createReadStream(source);
    rd.on('error', err => reject(err));
    const wr = fs.createWriteStream(target);
    wr.on('error', err => reject(err));
    wr.on('close', () => resolve());
    rd.pipe(wr);
  });

module.exports = { copyFile };
