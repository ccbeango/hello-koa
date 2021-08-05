const path = require('path');
const send = require('./koa-send');

function statices(opts = { root: '' }) {
  opts.root = path.resolve(opts.root);

  // 是否需要等待其它请求
  if (opts.defer !== true) {
    // 需要等待其它请求
    return async function statics(ctx, next) {
      let done = false;

      if(ctx.method === 'HEAD' || ctx.method  === 'GET') {
        try {
          await send(ctx, ctx.path, opts);
          done = true;
        } catch (error) {
          if (error.status !== 404) {
            throw error;
          }
        }
      }

      if (!done) {
        await next();
      }
    }
  } else {
    // 如果不需要等待其它请求
    return async function statics(ctx, next) {
      await next();

      if (ctx.method !== 'HEAD' && ctx.method !== 'GET') {
        return;
      }

      if (ctx.method != null || ctx.status !== 404) {
        return;
      }

      try {
        await send(ctx, ctx.path, opts);
      } catch (error) {
        if (err.status !== 404) {
          throw err;
        }
      }
    }
  }
}

module.exports = statices;
