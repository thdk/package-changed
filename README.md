# package-changed

This package is a quick and easy way of figuring out whether or not `package.json` has been modified.

It contains mainly code extracted from [install-changed](https://github.com/ninesalt/install-changed).

`install-changed` will run `npm install` when dependencies have changed while `package-changed` provides only the javascript api to tell you whether or not the dependencies have changed. What you further want to do with it is entirely up to you.


## Install

You can find this package on `npm` and can install it with `npm install package-changed`

## Usage
```
const {
  isPackageChanged
} = require('package-changed')

// run with default options
const hash = isPackageChanged();

// or run with custom options
const {
  hash,
  writeHash,
} = isPackageChanged({
  hashFilename: '.packagehash',
});

if (hash) {
  // dependencies in your package.json have changed since last run
  ...
  // call writeHash to write the lastes package hash to your disk
  writeHash();
}
```

### Options

**hashFilename** `'.packagehash'`

Filename where hash of dependencies will be written to.