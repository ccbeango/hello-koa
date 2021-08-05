const Koa = require('koa');
const path = require('path');
const content = require('./util/content');
const mimes = require('./util/mimes');


const app = new Koa();

// 静态资源目录相对于入口文件index.js的路径
const staticPath = './static';

// 解析资源类型
function parseMime(url) {
  let extName = path.extname(url);
  extName = extName ?  extName.slice(1) : 'unknown';
  return mimes[extName];
}

app.use(async ctx => {
  const fullStaticPath = path.join(__dirname, staticPath);

  // 获取静态资源内容，有可能是文件内容，目录，或404
  const contentRes = await content(ctx, fullStaticPath);

  // 解析请求内容的类型
  const mime = parseMime(ctx.url);

  // 如果有对应的文件类型，就配置上下文类型
  if(mime) ctx.type = mime;

  // 输出静态资源目录
  if (mime && mime.indexOf('image/') >= 0) {
    // 如果是图片，就使用node原生res输出二进制数据
    ctx.res.writeHead(200);
    ctx.res.write(contentRes, 'binary');
    ctx.res.end();
  } else {
    ctx.body = contentRes;
  }
});

app.listen(3000, () => {
  console.log('[demo] static-server is starting at port 3000')
});