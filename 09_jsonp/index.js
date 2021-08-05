const Koa = require('koa');
const app = new Koa();

app.use(async ctx => {
  // 如果jsonp的请求为get
  if (ctx.method === 'GET' && ctx.url.split('?')[0] === '/getData.jsonp') {
    // 获取jsonp的callback
    const callbackName = ctx.query.callback || 'callback';
    const returnData = {
      success: true,
      data: {
        text: 'this is a jsonp api',
        time: new Date().getTime()
      }
    };

    // jsonp的script字符串
    const jsonpStr = `;${callbackName}(${JSON.stringify(returnData)})`;

    // 用text/javascript，让请求支持跨域获取
    ctx.type = 'text/script';

    // 输出jsonp字符串
    ctx.body = jsonpStr;
  } else {
    ctx.body = 'hello jsonp'
  }
});

app.listen(3000, () => {
  console.log('[demo] jsonp is starting at port 3000')
});


// 在有jquery的网站运行看下 或者 自己写jsonp处理函数
// $.ajax({
//   url: 'http://localhost:3000/getData.jsonp',
//   type: 'GET',
//   dataType: 'jsonp',
//   success: function (data) {
//     console.log(data)
//   },
//   error(err) {
//     console.log(err)
//   }
// });
