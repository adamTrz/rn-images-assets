const mock = require('mock-fs');
const assert = require('assert');
const fs = require('fs');
const makeImages = require('../lib').makeImages;

beforeEach(() => {
  mock({
    'android/app/src/main/res': {},
    'ios/app/Images.xcassets': {},
    // images: {
    // 'some.png': new Buffer([8, 6, 7, 5, 3, 0, 9]),
    // },
  });
});
afterEach(() => mock.restore());

describe('test should have correct folders structure', () => {
  it('should have ./android/app/src/main/res path', done => {
    fs.open('./android/app/src/main/res', 'r', err => {
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
  it.skip('should exit with error if no images folder found', () => {
    assert.throws(() => {
      makeImages('./images');
    }, /Could not access pathname./);
  });
  it.skip('should throw an error if no images found at given path', () => {
    mock({ images: {} });
    assert.throws(() => {
      makeImages('./images');
    }, /Aborting/);
  });
});
