const path = require('path')
const readYaml = require('./yaml.js')
const moment = require('moment')
const pug = require('pug')
const md = require('markdown').markdown
const fs = require('fs')

const articles = readYaml(path.resolve(__dirname, '../article.yml'))
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
function createFolder (relativePath) {
  const prefix = '../..'
  const paths = relativePath.split('/')
  paths.reduce((leftVal, rightVal) => {
    const dir = leftVal + '/' + rightVal
    if (!fs.existsSync(dir)) fs.mkdirSync(dir)
    return dir
  }, prefix)
  return prefix + '/' + relativePath
}
// const pugVals = articles.map(info => {

//   // 把单个文章写入文件夹里面

//   return `<li class="article-item">${abstract}${articlefooter}</li>`
// })

const pagination = ''
const pageContainer = []
const totalPages = Math.ceil(articles.length / 5);
let page = 0
for (let i = 0; i < articles.length; i++) {
  const info = articles[i]
  const date = moment(info.date).format(`YYYY-MM-DD`)
  const articlepath = `/articles/${date}/${info.order}/`
  const article = md2html(path.resolve(__dirname, `../article.md/${info.filename}.md`))
  const abstract = generateAbstract(article.htmlTree)
  const articlefooter = `<div class="article-note"><span>编辑于 ${date}</span><a href="${articlepath}">阅读全文</a></div>`
  if (i % 5 === 0) {
    if (page > 1) {
      for (let j = 1; j <= totalPages; j++) {
        if (j === page) {
          pagination += `<span class="active">${j}<span>`
          continue;
        }
        pagination += `<span>${j}</span>`
      }
      
      fs.writeFileSync(`${createFolder(`page/${page}`)}/index.html`, pug.renderFile('../template.pug/index.pug', {
        articles: pageContainer.reverse().join(''),
        pagination,
      }))
    }
    page++
    pageContainer.length = 0
  }
  pageContainer.push(`<li class="article-item">${abstract}${articlefooter}</li>`)
  fs.writeFileSync(`${createFolder(`articles/${date}/${info.order}`)}/index.html`, pug.renderFile('../template.pug/index.pug', {
    articles: `<li class="article-item">${article.html}</li>`
  }))
}
if (page > 1) {
  fs.writeFileSync(`${createFolder(`page/${page}`)}/index.html`, pug.renderFile('../template.pug/index.pug', {
    articles: pageContainer.reverse().join('')
  }))
} else {
  fs.writeFileSync('../index.html', pug.renderFile('../template.pug/index.pug', {
    articles: pageContainer.reverse().join('')
  }))
}
