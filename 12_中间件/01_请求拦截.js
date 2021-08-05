const Koa = require('koa');
let app = new Koa();

const middleware = async (ctx, next) => {
  // 把所有请求不是 /page/ 开头的路径全部抛出500错误
  const path = ctx.request.path;
  if (path.indexOf('/page/') !== 0) {
    ctx.throw(500);
  }

  await next();
}

const page = async function(ctx, next) {
  ctx.body = `
      <html>
        <head></head>
        <body>
          <h1>${ctx.request.path}</h1>
        </body>
      </html>
    `; 
}

app.use(middleware);
app.use(page);

app.listen(3001, function(){
  console.log('the demo is start at port 3001');
})
