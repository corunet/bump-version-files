const fs = require('fs');
const xml2js = require('xml2js');
const path = require('path');

const parser = new xml2js.Parser();
const builder = new xml2js.Builder({
	xmldec: {
		version: '1.0',
		encoding: 'UTF-8'
	}
});


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
			throw new Error('Malformed switch! (maybe an unknown version type)');
	}
};

const incrementVersionProperty = (data, properties, increment) => {
	let version = data;
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

const incrementVersionFile = ({ filePath, property, separator = '.' }, increment) => {
	const dataString = fs.readFileSync(filePath);
	const properties = property.split(separator);
console.log(`

SEPARATOR ${separator}

`);
	switch(path.extname(filePath)) {
		case '.xml':
			let version;
			parser.parseString(dataString, (err, data) => {
				if (err) {
					throw new Error(err);
				} else {
					const versionResult = incrementVersionProperty(data, properties, increment);
					const pomStringNewVersion = builder.buildObject(versionResult.data);
					fs.writeFileSync(filePath, pomStringNewVersion);

					version = versionResult.version;
				}
			});

			return version;
		case '.json': {
			const json = JSON.parse(dataString);
			const { version, data: newJson } = incrementVersionProperty(json, properties, increment);
			fs.writeFileSync(filePath, JSON.stringify(newJson, null, '  '));

			return version;
		}
		default:
			throw new Error(`Don't know how to bump version in a ${path.extname(filePath)} file.`);
	}
};


exports.incrementVersionFile = incrementVersionFile;

