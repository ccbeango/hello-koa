const Koa = require('koa');
const path = require('path');
const logger = require('./koa-logger');
const send = require('./koa-send');
const statices = require('./koa-static');
const app = new Koa();

// koa logger
app.use(logger);
// koa send
// app.use(async ctx => {
//   await send(ctx, ctx.path, { root: `${__dirname}/public` });
// });

app.use(async (ctx, next) => {
  console.log('ctx.accept', ctx.accept)
  console.log('我是测试啊')
  await next();
  console.log('我是测试啊2')
})

// koa static
app.use(statices({
  root: path.join(__dirname, './public')
}));

app.use(async(ctx, next) => {
  if (ctx.path === '/hello') {
    ctx.body = 'hello world';
  }
});

app.listen(3001, () => {
  console.log('[demo] is starting at port 3000');
});