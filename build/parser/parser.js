const path = require('path')
const readYaml = require('./yaml.js')
const moment = require('moment')
const pug = require('pug')
const md = require('markdown').markdown
const fs = require('fs')

const articles = readYaml(path.resolve(__dirname, '../article.yml'))

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

function createFolder(relativePath) {
  const prefix = '../..'
  const paths = relativePath.split('/')
  paths.reduce((leftVal, rightVal) => {
    const dir = leftVal + '/' + rightVal
    if (!fs.existsSync(dir)) fs.mkdirSync(dir)
    return dir
  }, prefix)
  return prefix + '/' + relativePath
}

let pagination = ''
const pageContainer = []
const totalPages = Math.ceil(articles.length / 5);
let page = 0
for (let i = 0; i < 5; i++) {
  const info = articles.shift()
  const date = moment(info.date).format(`YYYY-MM-DD`)
  const articlepath = `/articles/${date}/${info.order}/`
  const article = md2html(path.resolve(__dirname, `../article.md/${info.filename}.md`))
  const abstract = generateAbstract(article.htmlTree)
  const articlefooter = `<div class="article-note"><span>编辑于 ${date}</span><a href="${articlepath}">阅读全文</a></div>`
  fs.writeFileSync(`${createFolder(`articles/${date}/${info.order}`)}/index.html`, pug.renderFile('../template.pug/index.pug', {
    articles: `<li class="article-item">${article.html}</li>`
  }))
  pageContainer.push(`<li class="article-item">${abstract}${articlefooter}</li>`)
}
if (totalPages > 1) {
  page++
  fs.writeFileSync('../index.html', pug.renderFile('../template.pug/index.pug', {
    articles: pageContainer.join(''),
    pagination: `<div><a class="next" href="/page/2">下一页</a></div>`
  }))
  pageContainer.length = 0
  for (i = 0; i < articles.length; i++) {
    const info = articles[i]
    const date = moment(info.date).format(`YYYY-MM-DD`)
    const articlepath = `/articles/${date}/${info.order}/`
    const article = md2html(path.resolve(__dirname, `../article.md/${info.filename}.md`))
    const abstract = generateAbstract(article.htmlTree)
    const articlefooter = `<div class="article-note"><span>编辑于 ${date}</span><a href="${articlepath}">阅读全文</a></div>`
    fs.writeFileSync(`${createFolder(`articles/${date}/${info.order}`)}/index.html`, pug.renderFile('../template.pug/index.pug', {
      articles: `<li class="article-item">${article.html}</li>`
    }))
    pageContainer.push(`<li class="article-item">${abstract}${articlefooter}</li>`)
    if (pageContainer.length === 5 || (i + 1 === articles.length && pageContainer.length < 5)) {
      page++
      if (page < totalPages) {
        pagination = `<div><a class="prev" href="/page/${page-1}">上一页</a><a class="next" href="/page/${page+1}">下一页</a></div>`
      } else {
        let path = ''
        if (page === 2) {
          path = '/' // 主页
        } else {
          path = '/page/' + (page - 1)
        }
        pagination = `<div><a class="prev" href="${path}">上一页</a></div>`
      }
      fs.writeFileSync(`${createFolder(`page/${page}`)}/index.html`, pug.renderFile('../template.pug/index.pug', {
        articles: pageContainer.join(''),
        pagination,
      }))
      pageContainer.length = 0;
    }
  }
} else {
  fs.writeFileSync('../index.html', pug.renderFile('../template.pug/index.pug', {
    articles: pageContainer.join(''),
    pagination,
  }))
}

// for (let i = 0; i < articles.length; i++) {

//   if (i % 5 === 0) {
//     pageContainer.length = 0
//   }
//   fs.writeFileSync(`${createFolder(`articles/${date}/${info.order}`)}/index.html`, pug.renderFile('../template.pug/index.pug', {
//     articles: `<li class="article-item">${article.html}</li>`
//   }))
//   console.log(i, pageContainer.length)
// }
// console.log(pageContainer)
// if (page > 1) {
//   fs.writeFileSync(`${createFolder(`page/${page}`)}/index.html`, pug.renderFile('../template.pug/index.pug', {
//     articles: pageContainer.reverse().join(''),
//     pagination,
//   }))
// } else {
//   fs.writeFileSync('../index.html', pug.renderFile('../template.pug/index.pug', {
//     articles: pageContainer.reverse().join(''),
//     pagination,
//   }))
// }