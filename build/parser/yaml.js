const yaml = require('js-yaml')
const fs = require('fs')

module.exports = function (path) {
	try {
		const doc = yaml.safeLoad(fs.readFileSync(path, 'utf8'))
		return doc
	}
	catch(e) {
		console.log(e)
		return null
	}
}
