/* eslint-env jest */

const fsmock = require('mock-fs');
const fs = require('fs');
const makeImages = require('../lib').makeImages;

beforeEach(() => {
  fsmock({
    'android/app/src/main/res/drawable': {},
    'ios/app/Images.xcassets': {},
  });
});
afterEach(() => fsmock.restore());

describe('test should have correct folders structure', () => {
  it('should have ./android/app/src/main/res/drawable path', done => {
    fs.open('./android/app/src/main/res/drawable', 'r', err => {
      if (err) done(err);
      else done();
    });
  });
  it('should have ./ios/app/Images.xcassets path', done => {
    fs.open('./ios/app/Images.xcassets', 'r', err => {
      if (err) done(err);
      else done();
    });
  });
});
describe('makeImages should work', () => {
  it('should exit with error if no images folder found', done => {
    makeImages('./images').catch(e => {
      expect(e).toBeTruthy();
      expect(e).toMatch(/Could not access pathname./);
      done();
    });
    done(false);
  });
  it('should throw an error if no images found at given path', done => {
    fsmock({ images: {} });
    makeImages('./images').catch(e => {
      expect(e).toBeTruthy();
      expect(e).toMatch(/No images found. Aborting./);
      done();
    });
    done(false);
  });
  it.skip('should copy images to Android path', done => {
    fsmock({
      'android/app/src/main/res/drawable': {},
      images: { 'some.png': new Buffer([8, 6, 7, 5, 3, 0, 9]) },
    });
    fs.open('./android/app/src/main/res/drawable', 'r', err => {
      if (err) done(err);
      else done();
    });
    makeImages('./images');
  });
});
