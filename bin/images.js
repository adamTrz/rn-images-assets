#!/usr/bin/env node
/* eslint no-console: 0 */

const fs = require('fs');
const path = require('path');
const makeImages = require('../lib/index').makeImages;

const printHelp = () => {
  const help = `
    rn-images-asseets

    Available commands: 
      -h, -help     Display this help
      -v, -version  Display version
      ./xxx/xxx     Copy images from ./xxx/xxx path
  `;
  console.log(help);
};

const version = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../package.json'), 'utf-8')
).version;

const printVersion = () => console.log(`Version: ${version}`);

const images = arg => {
  if (!arg) return printHelp();
  switch (arg) {
    case '-h':
    case '-help':
      return printHelp();
    case '-v':
    case '-version':
      return printVersion();
    default:
      return makeImages(arg);
  }
};

images(process.argv[2]);
