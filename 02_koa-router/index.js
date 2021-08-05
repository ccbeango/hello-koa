'use strict'

const Koa = require('koa');
const fs = require('fs');
const path = require('path');
const app = new Koa();

const Router = require('koa-router');

const home = new Router();
// 子路由1
home.get('/', async (ctx) => {
  const html = `
    <ul>
      <li><a href="/page/hello">/page/hello</a></li>
      <li><a href="/page/404">/page/404</a></li>
    </ul>
  `
  ctx.body = html;
});

const page = new Router();
// 子路由2
page.get('/404', async (ctx) => {
  ctx.body = '404 page';
}).get('/hello', async (ctx) => {
  ctx.body = 'hello page';
});

let router = new Router();

router.use('/', home.routes(), home.allowedMethods());
router.use('/page', page.routes(), page.allowedMethods());

app.use(router.routes()).use(router.allowedMethods());

app.listen(3000, () => {
  console.log('[demo] route-use-middleware is starting at port 3000');
})