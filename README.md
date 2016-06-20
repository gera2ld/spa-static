spa-static
===

![NPM](https://img.shields.io/npm/v/spa-static.svg)
![License](https://img.shields.io/npm/l/spa-static.svg)
![Downloads](https://img.shields.io/npm/dt/spa-static.svg)

A web server to serve static files for SPAs.

Installation
---
``` sh
$ npm i spa-static
```

Usage
---
Via JavaScript:
``` node
require('spa-static')({
  host: 'localhost',
  port: 4002,
}, (e, callback) => {
  if (e) throw e;
  console.log('Listening...');
});
```

Via bash:
``` sh
$ HOST=localhost PORT=4002 spa-static
```

Options
---
JavaScript options can be mapped to environment variables for running through scripts.

* HOST -> options.host: default as `localhost`
* PORT -> options.port: default as `4000`
* PREFIX -> options.prefix: default as `''`
* STATIC -> options.staticDir: default as `./static`
* INDEX -> options.index: default as `/index.html`
