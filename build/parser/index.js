const path = require('path')
const readYaml = require('./yaml.js')
const md = require('markdown').markdown
const fs = require('fs')

const config = readYaml(path.resolve(__dirname, '../article.yml'))
const article = md2html(path.resolve(__dirname, `../article.md/${config.filename}.md`))

function md2html(path) {
	const content = fs.readFileSync(path, 'utf8')
	try {
		return {
			html: md.toHTML(content),
			htmlTree: md.toHTMLTree(content)
		}
	} catch (e) {
		console.log(e)
		return null
	}
}

function generateAbstract(tree) {
	return md.renderJsonML(tree.slice(0, 3)) 
}
