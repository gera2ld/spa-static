# spa-static

![NPM](https://img.shields.io/npm/v/spa-static.svg)
![License](https://img.shields.io/npm/l/spa-static.svg)
![Downloads](https://img.shields.io/npm/dt/spa-static.svg)

A web server to serve static files for SPAs.

## Installation
``` sh
$ npm i spa-static
```

## Usage

### Shell command
``` sh
# Load from environment variables, only one server is supported
$ HOST=localhost PORT=4002 spa-static

# Load from config file, multiple servers are supported
$ spa-static -c config.js
```

### Node.js command
``` js
require('spa-static')(config, (e, callback) => {
  if (e) throw e;
  console.log('Listening...');
});
```

`config` can be either an object or an array of objects with properties
below:

* host

  Default as `process.env.HOST` or `localhost`

* port

  Default as `process.env.PORT` or `4000`

* prefix

  Default as `process.env.PREFIX` or `''`

* staticDir

  Default as `process.env.STATIC` or `./static`

* index

  Default as `process.env.INDEX` or `/index.html`

### Koa middleware

``` js
const Koa = require('koa');
const spaStatic = require('spa-static/lib/middleware');

const app = Koa();

app.use(spaStatic()); // use default settings
// or
app.use(spaStatic({
  staticDir: 'some/other/path',
}));
```
