const koa = require('koa');
const send = require('koa-send');
const compress = require('koa-compress');
const etag = require('koa-etag');

function startServer(config, callback) {
  function* checkETag(next) {
    yield next;
    const etag = this.get('If-None-Match');
    if (this.status === 200 && etag && etag === this.response.get('ETag')) {
      this.status = 304;
      this.body = '';
    }
  }
  function* serveStatic(next) {
    // this.set('Access-Control-Allow-Origin', '*');
    const path = config.prefix && this.path.startsWith(config.prefix) ? this.path.slice(config.prefix.length) : this.path;
    const filepath = yield send(this, path, staticOptions);
    if (!filepath) yield send(this, config.index, staticOptions);
  }

  if (typeof config === 'function') {
    callback = config;
    config = {};
  } else {
    config = config || {};
  }

  config.port = config.port || 4000;
  if (config.host == null) config.host = 'localhost';
  config.staticDir = config.staticDir || 'static';
  config.index = config.index || '/index.html';
  const staticOptions = {
    root: config.staticDir,
  };

  const app = koa();

  app
  .use(compress())
  .use(checkETag)
  .use(etag())
  .use(serveStatic);

  const server = app.listen(config.port, config.host, e => {
    callback && callback(e, server);
  });
}

module.exports = function (servers, callback) {
  if (!Array.isArray(servers)) servers = [servers];
  servers.forEach(config => startServer(config, callback));
};
