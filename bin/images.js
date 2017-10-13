#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const makeImages = require('../index').makeImages;

const printHelp = () => {
  return console.log('rn-images-asseets help: ...');
};
const version = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../package.json'), 'utf-8')
).version;

const printVersion = () => {
  return console.log(`rn-images-asseets. Version: ${version}`);
};

const images = arg => {
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
