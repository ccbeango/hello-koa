const Koa = require('koa');
const path = require('path');
const view = require('./koa-view');
const jsonp = require('./koa-jsonp');
const bodyParser = require('./koa-bodyparser');

const app = new Koa();

view(app, {
  baseDir: path.join(__dirname, 'view')
});

jsonp(app, {});

app.use(bodyParser());

app.use(async ctx => {
  if (ctx.path === '/jsonp') {
    await ctx.jsonp({
      data: 'this is a demo',
      success: true
    });
  } else if (ctx.path === '/hello') {
    await ctx.view(`${ctx.path}.html`, {
      title: '我是页面'
    });
  } else if (ctx.path === '/form') {
    await ctx.view(`${ctx.path}.html`, {
      title: 'formHTML'
    });
  } else if (ctx.path === '/post') {
    ctx.body = ctx.request.body;
  } else {
    ctx.body = '<h1>404</h1>';
  }
});

app.listen(3001, () => {
  console.log('[demo] is starting at port 3000');
});
