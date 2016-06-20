const koa = require('koa');
const send = require('koa-send');
const compress = require('koa-compress');
const etag = require('koa-etag');

module.exports = function (args, callback) {
  if (typeof args === 'function') {
    callback= args;
    args = {};
  } else {
    args = args || {};
  }

  args.port = args.port || 4000;
  if (args.host == null) args.host = 'localhost';
  args.staticDir = args.staticDir || 'static';
  args.index = args.index || '/index.html';
  const staticOptions = {
    root: args.staticDir,
  };

  const app = koa();

  app
  .use(compress())
  .use(function* (next) {
    yield next;
    const etag = this.get('If-None-Match');
    if (this.status === 200 && etag && etag === this.response.get('ETag')) {
      this.status = 304;
      this.body = '';
    }
  })
  .use(etag())
  .use(function* (next) {
    // this.set('Access-Control-Allow-Origin', '*');
    const path = args.prefix && this.path.startsWith(args.prefix) ? this.path.slice(args.prefix.length) : this.path;
    const filepath = yield send(this, path, staticOptions);
    if (!filepath) yield send(this, args.index, staticOptions);
  });

  const server = app.listen(args.port, args.host, e => {
    callback(e, server);
  });
};
