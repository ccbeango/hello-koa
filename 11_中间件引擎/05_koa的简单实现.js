const http = require('http');
const Emitter = require('events');

const context = {
  _body: null,
  get body () {
    return this._body;
  },
  set body (val) {
    this._body = val;
    this.res.end(this._body);
  }
};

class SimpleKoa extends Emitter {
  constructor() {
    super();
    this.middleware = [];
    this.context = Object.create(context);
  }

  listen (...args) {
    const server = http.createServer(this.callback());
    return server.listen(...args);
  }

  onerror(error) {
    console.log(error);
  }

  use(fn) {
    if (typeof fn === 'function') {
      this.middleware.push(fn);
    }
  }

  callback() {
    if (this.listeners('error').length !== 0) {
      this.on('error', this.onerror);
    }

    return (req, res) => {
      const context = this.createContext(req, res);

      const middleware = this.middleware;

      this.compose(middleware)(context)
        .catch(err => this.onerror(err))
    }
  }

  compose (middleware) {
    if(!Array.isArray(middleware)) {
      throw new TypeError('middleware must be an array');
    }

    let index = -1;
  
    return function (ctx, next) {
      const dispatch = (i) => {
        if (i <= index) {
          return Promise.reject(new Error('multiple calls'));
        }

        index = i;

        const fn = middleware[i];

        if (i === middleware.length) {
          fn = next;
        }

        if (!fn) {
          return Promise.resolve();
        }

        return new Promise((resolve, reject) => {
          try {
            resolve(fn(ctx, () => {
              return dispatch(i + 1);
            }));
          } catch (error) {
            reject(error);
          }
        });
      }

      return dispatch(0);
    }
  }

  createContext (req, res) {
    const context = Object.create(this.context);
    context.req = req;
    context.res = res;
    return context;
  }
}


const app = new SimpleKoa();
const PORT = 3001;

app.use(async (ctx, next) => {
  console.log('woshi中间件啊', ctx.hello = 'world')
  await next();
});

app.use(async ctx => {
  ctx.body = '<p>this is a body</p>';
});


app.listen(PORT, () => {
  console.log(`the web server is starting at port ${PORT}`);
});
