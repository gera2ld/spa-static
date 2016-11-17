const send = require('koa-send');
const compress = require('koa-compress');
const etag = require('koa-etag');
const conditional = require('koa-conditional-get');

function serveStatic(config) {
  const staticOptions = {
    root: config.staticDir || '.',
  };
  return function* (next) {
    // this.set('Access-Control-Allow-Origin', '*');
    const path = config.prefix && this.path.startsWith(config.prefix) ? this.path.slice(config.prefix.length) : this.path;
    const filepath = yield send(this, path, staticOptions);
    if (!filepath) yield send(this, config.index, staticOptions);
  };
}

function parseConfig(config) {
  if (typeof config === 'function') {
    callback = config;
    config = {};
  } else {
    config = config || {};
  }

  config.staticDir = config.staticDir || 'static';
  config.index = config.index || '/index.html';

  return config;
}

module.exports = function (config) {
  config = parseConfig(config);
  const middlewares = [
    conditional(),
    etag(),
    compress(),
    serveStatic(config),
  ];
  return function* (next) {
    for (let i = middlewares.length; i --;) {
      const middleware = middlewares[i];
      next = middleware.call(this, next);
    }
    yield* next;
  };
};
