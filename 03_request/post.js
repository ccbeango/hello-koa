const Koa = require('koa');

const app = new Koa();

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
    ctx.body = await parsePostData(ctx);
  } else {
    ctx.body = '<h2>404</h2>'
  }
});


// 解析上下文里node原生请求的POST参数
function parsePostData(ctx) {
  return new Promise((resolve, reject) => {
    try {
      let postdata = '';
      ctx.req.addListener('data', (data) => {
        postdata += data;
      });
      ctx.req.addListener('end', (data) => {
        let parseData = parseQueryStr(postdata);
        resolve(parseData);
      });
    } catch (error) {
      
    }
  });
}

// 将POST请求参数字符串解析成JSON
function parseQueryStr(queryStr) {
  const queryData = {};
  const queryStringList = queryStr.split('&');
  for (let [ index, queryStr ] of queryStringList.entries()) {
    let itemList = queryStr.split('=');
    queryData[itemList[0]] = decodeURIComponent(itemList[1]);
  }
  return queryData;
}

app.listen(3000, () => {
  console.log('[demo] request post is starting at port 3000')
})
