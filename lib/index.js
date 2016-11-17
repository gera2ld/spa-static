const koa = require('koa');
const middleware = require('./middleware');

function startServer(config={}, callback) {
  const app = koa();
  app.use(middleware(config));

  config.port = config.port || 4000;
  if (config.host == null) config.host = 'localhost';

  const server = app.listen(config.port, config.host, e => {
    callback && callback(e, server);
  });
}

module.exports = function (servers, callback) {
  if (!Array.isArray(servers)) servers = [servers];
  servers.forEach(config => startServer(config, callback));
};
