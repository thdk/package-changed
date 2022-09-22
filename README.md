# package-changed

This package is a quick and easy way of figuring out whether or not `package.json` has been modified.

It contains mainly code extracted from [install-changed](https://github.com/ninesalt/install-changed).

`install-changed` will run `npm install` when dependencies have changed. `package-changed` also provides this functionality. However, it does give you **more control** on what should happen when dependencies in your package.json file have changed.

## Install

You can find this package on `npm` and can install it with:

`npm install package-changed`

However, you can use it without having to install it using `npx`:

`npx package-changed`

## Documentation

### CLI

Use **package-changed** simply by running following from your project root:

`npx package-changed`

This is, in fact, a shorthand for the following commands:

`npx package-changed run "npm install"`

or if you have an **environmental variable** `CI` with value set to `true` then it will run:

`npx package-changed run "npm ci"`

However, using the `run` command you can specify any command which you want to run in case your dependencies have changed since the last run.

```
npx package-changed run "echo 'Run any command when your package has changed'"
```

#### All CLI options

**package-changed**

```
Options:
  --cwd [cwd]                 Current working directory.
  --hash-filename [filename]  Filename where hash of dependencies will be written to
  --lockfile                  Include package-lock.json content in hash
  --no-hash-file              Skip writing new hash to .packagehash file
  -h, --help                  display help for command

Commands:
  run [command]
  install [options]
  help [command]              display help for command
```

**package-changed install**

```
Usage: package-changed install [options]

Options:
  --ci        Run 'npm ci' instead of 'npm i'. Even when package is not changed. Default when env.CI=true
  -r, --registry <registry>  npm registry url to use
  -h, --help  display help for command
```

**package-changed run**

```
Usage: package-changed run [options] [command]

Options:
  -h, --help  display help for command
```

#### Use git hooks to run **package-changed** automatically


**package-changed** can be run automatically with git hooks, for example: when switching branches. [Husky](https://github.com/typicode/husky) is a popular choice for configuring git hooks.

With Husky installed:

```shell
npx husky add .husky/post-checkout "npx --no package-changed"
npx husky add .husky/post-merge "npx --no package-changed"
npx husky add .husky/post-rebase "npx --no package-changed"
```


### Javascript API

```javascript
isPackageChanged(
  options?: PackageChangedOptions,
  callback?: (result: PackageChangedCallbackResult) => Promise<boolean>,
): Promise<PackageChangedResult>;
```

#### Example usage
```javascript
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
} = await isPackageChanged({
  hashFilename: '.packagehash',
});

if (isChanged) {
  // dependencies in your package.json have changed since last run
  ...
  // call writeHash to write the latest package hash to your disk
  writeHash();
}

// or use the callback argument
isPackageChanged(
  undefined, // using default options
  ({isChanged}) => {
    // ...

    return true; // or false if you don't want the hash to be written
  },
);
```

**PackageChangedOptions**
| Property      | Type    | Description                                             | Required | Default          |
| ------------- | ------- | ------------------------------------------------------- | -------- | ---------------- |
| cwd           | string  | Current working directory                               | false    | `process.cwd()`  |
| hashFilename  | string  | Filename where hash of dependencies will be written to. | false    | `'.packagehash'` |
| lockfile      | boolean | Include package-lock.json content in hash.              | false    | `false`          |
| noHashFile    | boolean | Skip writing new hash to .packagehash file.              | false    | `false`          |


**PackageChangedCallbackResult**
| Property  | Type                | Description                                                                       |
| --------- | ------------------- | --------------------------------------------------------------------------------- |
| isChanged | boolean             | Filename where hash of dependencies will be written to.                           |
| hash      | string              | The hash for the current listed dependencies in `package.json`                    |
| oldHash   | string \| undefined | The hash used to compare newHash with. `undefined` if no previous hash was found. |


**PackageChangedResult**
| Property  | Type                | Description                                                                       |
| --------- | ------------------- | --------------------------------------------------------------------------------- |
| isChanged | boolean             | Filename where hash of dependencies will be written to.                           |
| hash      | string              | The hash for the current listed dependencies in `package.json`                    |
| oldHash   | string \| undefined | The hash used to compare newHash with. `undefined` if no previous hash was found. |
| writeHash | function            | Function which needs to be called after the cache has been succesfully restored.  |



