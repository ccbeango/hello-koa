function isError(err) {
  return Object.prototype.toString.call(err).toLowerCase() === '[object error]';
}

function streamEventListen(req, callback) {
  const stream = req.req || req;
  let chunk = [];
  let complete = false;

  // attach listeners
  stream.on('aborted', onAborted);
  stream.on('close', cleanup);
  stream.on('data', onData);
  stream.on('end', onEnd);
  stream.on('error', onEnd);

  function onAborted() {
    if (complete) return;
    callback(new Error('request body parse aborted'));
  }

  function cleanup() {
    stream.removeListener('aborted', onAborted);
    stream.removeListener('data', onData);
    stream.removeListener('end', onEnd);
    stream.removeListener('error', onEnd);
    stream.removeListener('close', cleanup);
  }

  function onData(data) {
    if(complete) return;
    if(data) {
      chunk.push(data.toString());
    }
  }

  function onEnd(err) {
    if(complete) return;

    if (isError(err)) {
      callback(err);
      return;
    }
    
    complete = true;
    const result = chunk.join('');
    chunk = [];
    callback(null, result);
  }
}

function readStream (req) {
  return new Promise((resolve, reject) => {
    try {
      streamEventListen(req, (err, data) => {
        if (data && !isError(err)) {
          resolve(data);
        } else {
          reject(err);
        }
      });
    } catch (error) {
      reject(error);
    }
  });
}

const stringJsonRegx = /^[\x20\x09\x0a\x0d]*(\[|\{)/;

const jsonTypes = [ 'application/json' ];

const formTypes = [ 'application/x-www-form-urlencoded' ];

const textTypes = [ 'text/plain' ];

function parseQueryStr(queryStr) {
  const queryData = {};
  const queryStrList = queryStr.split('&');

  for (let [ index, item ] of queryStrList.entries()) {
    const itemList = item.split('=');
    queryData[itemList[0]] = decodeURIComponent(itemList[1]);
  }

  return queryData;
}

function bodyParser(opts) {
  return async function(ctx, next) {
    // 拦截post请求
    if(!ctx.request.body && ctx.method === 'POST') {
      // 解析请求中的表单信息 
      const body = await readStream(ctx.request.req);
      let result = body;
      if (ctx.request.is(formTypes)) {
        result = parseQueryStr(body);
      } else if (ctx.request.is(jsonTypes)) {
        if (stringJsonRegx.test(body)) {
          try {
            result = JSON.parse(body);
          } catch (error) {
            ctx.throw(500, err);
          }
        }
      } else if (ctx.request.is(textTypes)) {
        result = body;
      }

      // 将请求体中的信息挂载到山下文的request 属性中
      ctx.request.body = result;
    }

    await next();
  }
}

module.exports = bodyParser;

