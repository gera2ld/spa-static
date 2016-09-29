const fs = require('fs');
const path =require('path');
const run = require('.');

function loadFromEnv(env) {
  env = env || process.env;
  return [{
    host: env.HOST,
    port: env.PORT,
    staticDir: env.STATIC,
    index: env.INDEX,
    prefix: env.PREFIX,
  }];
}

function loadConf() {
  return new Promise((resolve, reject) => {
    const i = process.argv.indexOf('-c');
    const conf = ~i && process.argv[i + 1];
    conf ? resolve(conf) : reject();
  })
  .then(conf => require(path.resolve(conf)))
  .catch(() => loadFromEnv());
}

loadConf()
.then(conf => run(conf, (e, server) => {
  if (e) {
    console.error(e);
  } else {
    const addr = server.address();
    console.log(`Listening at ${addr.address}:${addr.port}...`);
  }
}), err => {
  console.error(err);
});
