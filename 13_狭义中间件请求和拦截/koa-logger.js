const logger = async (ctx, next) => {
  // 拦截操作请求 request
  console.log(`<-- ${ctx.method} ${ctx.url}`);

  await next();

  ctx.res.on('finish', () => {
    console.log(`--> ${ctx.method} ${ctx.url}`);
  })
}

module.exports = logger;