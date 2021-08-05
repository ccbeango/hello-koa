
function compose(middlewares) {
  if(!Array.isArray(middlewares)) {
    throw new TypeError('middlewares must be an array');
  }

  return function(ctx, next) {
    let index = -1;

    function dispatch (i) {
      if (i <= index) {
        return Promise.reject(new Error('multiple calls'));
      }

      index = i
      
      let fn = middlewares[i];

      if (i === middlewares.length) {
        fn = next;
      }

      if (!fn) {
        return Promise.resolve();
      }

      try {
        return Promise.resolve(fn(ctx, () => {
          return dispatch(i + 1);
        }));
      } catch (error) {
        return Promise.reject(error);
      }
    }

    return dispatch(0);
  }
}

module.exports = compose;

let middleware = [];
let context = {
  data: []
};

middleware.push(async(ctx, next) => {
  console.log('action 001');
  ctx.data.push(1);
  await next();
  console.log('action 006');
  ctx.data.push(6);
});

middleware.push(async(ctx, next) => {
  console.log('action 002');
  ctx.data.push(2);
  await next();
  console.log('action 005');
  ctx.data.push(5);
});

middleware.push(async(ctx, next) => {
  console.log('action 003');
  ctx.data.push(3);
  await next();
  console.log('action 004');
  ctx.data.push(4);
});

const fn = compose(middleware);

fn(context)
  .then(() => {
    console.log('end');
    console.log('context = ', context);
  });

