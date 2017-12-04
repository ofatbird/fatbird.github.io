const path = require('path')
const readYaml = require('./yaml.js')
const moment = require('moment')
const pug = require('pug')
const html2pug = require('html2pug')
const md = require('markdown').markdown
const fs = require('fs')

const config = readYaml(path.resolve(__dirname, '../article.yml'))
const article = md2html(path.resolve(__dirname, `../article.md/${config.filename}.md`))

function md2html (path) {
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

function generateAbstract (tree) {
  return md.renderJsonML(tree.slice(0, 3))
}

function createFolder (date) {
	if(!fs.existsSync(`../../${date}`)) fs.mkdirSync(`../../${date}`)
	if(!fs.existsSync(`../../${date}/${config.order}`)) fs.mkdirSync(`../../${date}/${config.order}`)
  fs.writeFileSync(`../../${date}/${config.order}/index.html`, pug.renderFile('../template.pug/index.article.pug'))
}

function paginate () {
}
// console.log(pug.renderFile('../template.pug/index.pug', {
// 	articles: [generateAbstract(article.htmlTree)]
// }))
// console.log(article.html)
// console.log(generateAbstract(article.htmlTree))

const aricle_pug = fs.readFileSync('../template.pug/articles.pug', 'utf8')
const abstract = generateAbstract(article.htmlTree)
const articlepath = `/${moment(config.date).format('MM-DD-YYYY')}/${config.order}/index.html`
const articlefooter = '<div class="article-note"><span>编辑于 ' + moment(config.date).format('MM-DD-YYYY') + '</span><a href="'+ articlepath +'">阅读全文</a></div>'
const pugString = html2pug('<ul><li class="article-item">' + abstract + articlefooter + '</li></ul>', {fragment: true})

fs.writeFileSync('../template.pug/articles.pug', aricle_pug.replace('ul', pugString))
fs.writeFileSync('../template.pug/article.pug', html2pug(article.html, {fragment: true}))
createFolder(moment(config.date).format('YYYY-MM-DD'))
