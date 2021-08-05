const methods = [
  'GET',
  'PUT',
  'PATCH',
  'POST',
  'DELETE'
];


class Layer {
  constructor(path, methods, middleware, opts) {
    this.path = path;
    this.methods = methods;
    this.middleware = middleware;
    this.opts = opts;
  }
}

class Router {
  constructor (opts = {}) {
    this.stack = [];
  }

  register(path, methods, middleware, opts) {
    const route = new Layer(path, methods, middleware, opts);
    this.stack.push(route);
    return this;
  }

  routes() {
    const stack = this.stack;
    return async function(ctx, next) {
      let route;

      for(let i = 0; i < stack.length; i++) {
        const item = stack[i];
        if (ctx.path === item.path &&
          item.methods.indexOf(ctx.method) >= 0) {
          route = item.middleware;
          break;
        }
      }

      if (typeof route === 'function') {
        route(ctx, next);
        return;
      }

      await next();
    }
  }
}

methods.forEach(method => {
  Router.prototype[method.toLowerCase()] = Router.prototype[method] = 
  function(path, middleware) {
    this.register(path, [method], middleware);
  }
});

module.exports = Router;
