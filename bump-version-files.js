#!/usr/bin/env node

const fs = require('fs');
const xml2js = require('xml2js');
const path = require('path');

const parser = new xml2js.Parser();
const builder = new xml2js.Builder();


const USAGE = 'USO: bump-version (mayor|minor|patch) ./path/to/filesConfig.json';

console.log('CWD', process.cwd());

const params = {};
try {
	if (process.argv < 4) {
		throw new Error('Número de argumentos no válido.');
	}

	params.increment = process.argv[2] && process.argv[2].toLowerCase();
	if (process.argv[3].startsWith('/')) {
		params.filesConf = process.argv[3];
	} else {
		params.filesConf = `${process.cwd()}/${process.argv[3]}`;
	}

	if (['mayor', 'minor', 'patch'].indexOf(params.increment) < 0) {
		throw new Error('No entiendo qué versión hay que subir: ¿mayor, minor o patch?');
	}

	fs.accessSync(params.filesConf, fs.constants.R_OK);

} catch (e) {
	console.log(USAGE);
	throw e;
}

const FILES = require(params.filesConf);


const incrementVersion = (current, increment) => {
	let [mayor, minor, patch] = current.split('.');
	switch (increment) {
		case 'mayor':
			return `${+mayor + 1}.0.0`;
		case 'minor':
			return `${mayor}.${+minor + 1}.0`;
		case 'patch':
			return `${mayor}.${minor}.${+patch + 1}`;
		default:
			throw new Error('No entiendo qué versión hay que subir.');
	}
};

const incrementVersionProperty = (data, property, increment) => {
	let version = data;
	const properties = property.split('.');
	const versionProperty = properties.pop();
	properties.forEach(prop => version = version[prop]);
	const oldVersion = version[versionProperty];
	const newVersion = incrementVersion(oldVersion, increment);

	version[versionProperty] = newVersion;

	return {
		data,
		version: {
			from: oldVersion,
			to: newVersion
		}
	};
};

const incrementVersionFile = ({ filePath, property }, increment) => {
	const dataString = fs.readFileSync(filePath);
	switch(path.extname(filePath)) {
		case '.xml':
			parser.parseString(dataString, (err, data) => {
				if (err) {
					throw new Error(err);
				} else {
					const { version, data: newData } = incrementVersionProperty(data, property, increment);
					const pomStringNewVersion = builder.buildObject(newData);
					console.log(`Subiendo ${version.from} => ${version.to} en ${filePath}.`);
					fs.writeFileSync(filePath, pomStringNewVersion);
				}
			});
			break;
		case '.json': {
			const json = JSON.parse(dataString);
			const { version, data: newJson } = incrementVersionProperty(json, property, increment);
			fs.writeFileSync(filePath, JSON.stringify(newJson, null, '  '));
			console.log(`Subiendo ${version.from} => ${version.to} en ${filePath}.`);
			break;
		}
		default:
			throw new Error(`No sé cambiar la versión a un ${path.extname(filePath)}`);
	}
};

FILES.forEach(file => incrementVersionFile(file, params.increment));
