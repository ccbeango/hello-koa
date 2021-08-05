const Koa = require('koa');
const app = new Koa();
const bodyParser = require('koa-bodyparser');

// 使用ctx.body解析中间件
app.use(bodyParser());

app.use(async (ctx) => {
  if (ctx.url === '/' && ctx.method === 'GET') {
    const html = `
      <h1>koa2 request post demo</h1>
      <form method="POST" action="/">
        <p>userName</p>
        <input name="userName" /><br/>
        <p>nickName</p>
        <input name="nickName" /><br/>
        <p>email</p>
        <input name="email" /><br/>
        <button type="submit">submit</button>
      </form>
    `;
    ctx.body = html;
  } else if (ctx.url === '/' && ctx.method === 'POST') {
    ctx.body = ctx.request.body;
  } else {
    ctx.body = '<h2>404</h2>'
  }
});

app.listen(3000, () => {
  console.log('[demo] request post is starting at port 3000')
})
