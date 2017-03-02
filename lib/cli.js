const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const startServer = require('.');

function loadConfig() {
  let filepath;
  [
    process.argv[2],
    'config.yml',
    'config.json',
    'config.js',
  ]
  .filter(i => i)
  .some(filename => {
    filename = path.resolve(filename);
    try {
      fs.accessSync(filename);
    } catch (e) {
      return;
    }
    return filepath = filename;
  });
  if (!filepath) {
    console.error('No config file is found!');
    return;
  }
  let config;
  if (['.yml', '.yaml'].includes(path.extname(filepath))) {
    config = yaml.safeLoad(fs.readFileSync(filepath, 'utf8'));
  } else {
    config = require(path.resolve(filepath));
  }
  if (!Array.isArray(config)) {
    console.log(`Invalid config file: ${filepath}`);
  }
  return config;
}

const config = loadConfig();
config && config.forEach(options => startServer(options, (e, server) => {
  if (e) {
    console.error(e);
  } else {
    const addr = server.address();
    console.log(`Listening at ${addr.address}:${addr.port}...`);
  }
}));
