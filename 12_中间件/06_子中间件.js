const Koa = require('koa');
const app = new Koa();

class Middleware {
  constructor () {
    this.stack = [];
  }

  get(path, childMiddleware) {
    this.stack.push({
      path,
      middleware: childMiddleware
    })
  }

  middlewares () {
    return async (ctx, next) => {
      for(let item of this.stack) {
        if (item.path === ctx.path && item.middleware) {
          await item.middleware(ctx, next);
        }
      }
      await next();
    }
  }
}

const middleware = new Middleware();

middleware.get('/page/001', async (ctx, next) => { ctx.body = 'page 001' });
middleware.get('/page/002', async (ctx, next) => { ctx.body = 'page 001' });
middleware.get('/page/003', async (ctx, next) => { ctx.body = 'page 001' });

app.use(middleware.middlewares());

app.listen(3001, function(){
  console.log('the demo is start at port 3001');
});
