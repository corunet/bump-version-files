# Bump-version-files

Tired of editing tons of pom.xml and package.json every time you need to publish a new version? bump-version-files is the utility you are looking for!

## Getting Started

Copy versionFiles.example.json include in this package to versionFiles.json somewhere in your project, and use it to tell bump-version-files where do you store your version numbers.
You will have to set the path to the file and the property where the version is, for every file.

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

## Versioning

We use [SemVer](http://semver.org/) for versioning.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
