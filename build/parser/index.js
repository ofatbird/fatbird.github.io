const path = require('path')
const readYaml = require('./yaml.js')
const pug = require('pug')
const html2pug = require('html2pug')
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

// console.log(pug.renderFile('../template.pug/index.pug', {
// 	articles: [generateAbstract(article.htmlTree)]
// }))
// console.log(article.html)
// console.log(generateAbstract(article.htmlTree))

const aricle_pug = fs.readFileSync('../template.pug/articles.pug', 'utf8')
const abstract = generateAbstract(article.htmlTree)

const pugString = html2pug('<ul><li class="article-item">'+abstract+'</ul></li>', {fragment: true})

fs.writeFileSync('../template.pug/articles.pug', aricle_pug.replace('ul', pugString))
fs.writeFileSync('../index.html', pug.renderFile('../template.pug/index.pug')) 