#!/usr/bin/env node

const fs = require('fs');
const incrementVersionFile = require('.').incrementVersionFile;


const USAGE = 'USE: bump-version ./path/to/filesConfig.json (mayor|minor|patch)';

const params = {};
try {
	if (process.argv < 4) {
		throw new Error('Need 2 arguments.');
	}

	if (process.argv[2].startsWith('/')) {
		params.filesConf = process.argv[2];
	} else {
		params.filesConf = `${process.cwd()}/${process.argv[2]}`;
	}
	params.increment = process.argv[3] && process.argv[3].toLowerCase();

	if (['mayor', 'minor', 'patch'].indexOf(params.increment) < 0) {
		throw new Error('Which version do you want to upgrade: mayor, minor or patch?');
	}

	fs.accessSync(params.filesConf, fs.constants.R_OK);

} catch (e) {
	console.log(USAGE);
	throw e;
}

const FILES = require(params.filesConf);

FILES.forEach(file => incrementVersionFile(file, params.increment));

