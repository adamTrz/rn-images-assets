/* @flow */
const fs = require('fs');

const makeDir = (pathname: string): Promise<string | boolean> =>
  new Promise((resolve, reject) => {
    fs.mkdir(pathname, 0o777, e => {
      if (!e || e.code === 'EEXIST') resolve(true);
      else reject(e);
    });
  });

exports.makeDir = makeDir;
