const Koa = require('koa');
const app = new Koa();

app.use((ctx) => {
  const url = ctx.url;

  // 从req中获取
  const request = ctx.request;
  const reqQuery = request.query;
  const reqQuerystring = request.querystring;

  // 从ctx上获取
  const ctxQuery = ctx.query;
  const ctxQuerystring = ctx.querystring;

  ctx.body = {
    url,
    reqQuery,
    reqQuerystring,
    ctxQuery,
    ctxQuerystring
  } 
});

// http://localhost:3000/hello/world?name=tom&age=18

app.listen(3000, () => {
  console.log('[demo] request get is starting at port 3000');
})
