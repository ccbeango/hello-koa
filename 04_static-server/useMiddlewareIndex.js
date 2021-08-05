const Koa = require('koa');
const path = require('path');
const static = require('koa-static');

const app = new Koa();

// 静态资源目录相对于入口文件index.js的路径
const staticPath = './static';

app.use(static(path.join(__dirname, staticPath)))

app.use(async ctx => {
  ctx.body = 'hello wrold';
});

app.listen(3000, () => {
  console.log('[demo] static-server is starting at port 3000')
});