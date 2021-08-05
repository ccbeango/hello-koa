'use strict'

const Koa = require('koa');
const fs = require('fs');
const path = require('path');
const app = new Koa();

/**
 * 用Promise封装异步读取文件方法
 * @param {string} page 
 * @returns {promise}
 */
function render (page) {
  return new Promise((resolve, reject) => {
    let viewUrl = path.resolve(__dirname, `./view/${page}`);

    fs.readFile(viewUrl, 'binary', (err, data) => {
      if(err) return reject(err);
      return resolve(data);
    });
  });
}

async function route(url) {
  let view = '404.html';
  switch(url) {
    case '/':
    case '/index':
      view = 'index.html';
      break;
    case '/todo':
      view = 'todo.html';
      break;
    case '/404':
      view = '404.html';
    default:
      break;
  }
  let html = await render(view);
  return html;
}


app.use(async (ctx) => {
  let url = ctx.request.url;
  const html = await route(url);
  ctx.body = html;
});

app.listen(3000);
console.log('[demo] route-simple is starting at port 3000')
