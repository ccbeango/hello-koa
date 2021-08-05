const Koa = require('koa');
const views = require('koa-views');
const path = require('path');
const static = require('koa-static');
const { uploadFile } = require('./util/upload');

const app = new Koa();

// 模板引擎
app.use(views(path.join(__dirname, './view'), {
  extension: 'ejs'
}));

// 静态资源服务
app.use(static(path.join(__dirname, './static')));

app.use(async ctx => {
  if (ctx.method === 'GET') {
    let title = 'upload pic async'
    await ctx.render('index', {
      title,
    })
  } else if (ctx.method === '/api/picture/upload.json' && ctx.method === 'POST') {
    // 上传文件请求处理
    let result = { success: false };
    const serverFilePath = path.join(__dirname, './static/image');

    result = await uploadFile(ctx, {
      fileType: 'album',
      path: serverFilePath
    });
    ctx.body = result;
  } else {
    // 其他请求显示404
    ctx.body = '404'
  }
});

app.listen(3000, () => {
  console.log('[demo] upload-pic-async is starting at port 3000');
});
