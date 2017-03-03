const send = require('koa-send');
const compress = require('koa-compress');
const etag = require('koa-etag');
const conditional = require('koa-conditional-get');
const compose = require('koa-compose');

function serveStatic(options) {
  const {
    headers,
    staticDir='static',
    prefix='',
    index='/index.html',
  } = options || {};
  const staticOptions = {
    root: staticDir,
  };
  return async function (ctx, next) {
    headers && Object.keys(headers).forEach(key => {
      ctx.set(key, headers[key]);
    });
    let path = ctx.path;
    if (prefix && path.startsWith(prefix)) path = path.slice(prefix.length);
    const filepath = await send(ctx, path, staticOptions);
    if (!filepath) await send(ctx, index, staticOptions);
  };
}

module.exports = options => compose([
  conditional(),
  etag(),
  compress(),
  serveStatic(options),
]);
