const koa = require('koa');
const send = require('koa-send');
const compress = require('koa-compress');
const etag = require('koa-etag');
const env = process.env;

const port = env.PORT || 4000;
const host = env.HOST == null ? 'localhost' : env.HOST;
const prefix = env.PREFIX;
const staticDir = env.STATIC || 'static';
const index = env.INDEX || '/index.html';
const staticOptions = {
  root: staticDir,
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
  const path = prefix && this.path.startsWith(prefix) ? this.path.slice(prefix.length) : this.path;
  const filepath = yield send(this, path, staticOptions);
  if (!filepath) yield send(this, index, staticOptions);
})
.listen(port, host, e => {
  if (e) console.error(e);
  else console.log(`Listening at ${host}:${port}...`);
});
