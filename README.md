# package-changed

This package is a quick and easy way of figuring out whether or not `package.json` has been modified.

It contains mainly code extracted from [install-changed](https://github.com/ninesalt/install-changed).

`install-changed` will run `npm install` when dependencies have changed while `package-changed` provides only the javascript api to tell you whether or not the dependencies have changed. What you further want to do with it is entirely up to you.


## Install

You can find this package on `npm` and can install it with `npm install package-changed`

## Example usage
```
const {
  isPackageChanged
} = require('package-changed')

// run with default options
const {
  isChanged,
} = isPackageChanged();

// or run with custom options
const {
  isChanged,
  writeHash,
} = isPackageChanged({
  hashFilename: '.packagehash',
});

if (isChanged) {
  // dependencies in your package.json have changed since last run
  ...
  // call writeHash to write the latest package hash to your disk
  writeHash();
}
```

### Documentation

```javascript
isPackageChanged(
  options?: PackageChangedOptions,
): PackageChangedResult;
```
**PackageChangedOptions**
| Property     | Type   | Description                                             | Required | Default          |
| ------------ | ------ | ------------------------------------------------------- | -------- | ---------------- |
| hashFilename | string | Filename where hash of dependencies will be written to. | false    | `'.packagehash'` |
| cwd          | string | Current working directory                               | false    | `process.cwd()`  |


**PackageChangedResult**
| Property  | Type                | Description                                                                       |
| --------- | ------------------- | --------------------------------------------------------------------------------- |
| isChanged | boolean             | Filename where hash of dependencies will be written to.                           |
| oldHash   | string \| undefined | The hash used to compare newHash with. `undefined` if no previous hash was found. |
| hash      | string              | The hash for the current listed dependencies in `package.json`                    |
| writeHash | function            | Function which needs to be called after the cache has been succesfully restored.  |


