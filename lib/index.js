const Koa = require('koa');
const middleware = require('./middleware');

module.exports = function startServer(options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  } else {
    options = options || {};
  }

  const app = new Koa();
  app.use(middleware(options));
  const {host='localhost', port=4000} = options;

  const server = app.listen(port, host, e => {
    callback && callback(e, server);
  });
  return server;
}
