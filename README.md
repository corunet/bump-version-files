# Bump-version-files

Tired of editing tons of pom.xml and package.json every time you need to publish a new version? bump-version-files is the utility you are looking for!

## Getting Started

### Installing

To install in the local node_modules:
```sh
npm install --save-dev bump-version-files
```
or
```sh
yarn add bump-version-files --dev
```

Or you can install it as a global package:
```sh
npm install --global bump-version-files
```
or
```sh
yarn global add bump-version-files
```

### Prerequisites

Copy `versionFiles.example.json` included in this package to `versionFiles.json` somewhere in your project, and use it to tell bump-version-files where do you store your version numbers.
You will have to set the path to the file and the property where the version is, for every file.


### Bump version

#### Local install

The best way is to add to your `package.json`:
```json
{
	"scripts": {
		"bump-version": "bump-version-files ./path/to/versionFiles.json"
	}
}
```

so we can do:
```sh
node run bump-version patch
```

or
```sh
yarn bump-version patch
```

#### Global install

```sh
bump-version-files ./path/to/versionFiles.json patch
```

## Versioning

We use [SemVer](http://semver.org/) for versioning.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
