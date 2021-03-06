function jsonp(app, opts = {}) {
  const callback = opts.callback || 'callback';

  app.context.jsonp = function (obj = {}) {
    const ctx = this;
    if (Object.prototype.toString.call(obj).toLowerCase() === '[object object]') {
      const jsonpStr = `;${callback}(${JSON.stringify(obj)})`;

      // 用text/javascript 让请求支持跨域获取
      ctx.type = 'text/javascript';

      // 输出jsonp字符串
      ctx.body = jsonpStr;
    } else {
      ctx.throw(500, 'result most be a json');
    }
  }
}

module.exports = jsonp;
