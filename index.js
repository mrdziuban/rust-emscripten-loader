const child_process = require('child_process');
const fs = require('fs');
const loaderUtils = require('loader-utils');
const path = require('path');
const toml = require('toml');

const targets = {
  wasm: 'wasm32',
  wasm32: 'wasm32',
  asm: 'asmjs',
  asmjs: 'asmjs'
};

module.exports = function(source) {
  const callback = this.async();
  const srcDir = path.dirname(path.dirname(this.resourcePath));
  const packageName = toml.parse(fs.readFileSync(path.join(srcDir, 'Cargo.toml'), 'utf8').toString()).package.name;

  const opts = loaderUtils.getOptions(this);
  const release = opts ? opts.release : false;
  const target = opts && opts.target ? targets[opts.target] : 'asmjs';

  if (!target) { return callback(new Error(`Unknown target: ${opts.target}`), null); }
  if (target === 'wasm32' && !opts.outName) { return callback(new Error('You must specify the `outName` option'), null); }
  const rustTarget = `${target}-unknown-emscripten`;

  const outDir = path.join(srcDir, 'target', rustTarget, (release ? 'release' : 'debug'));
  const outFile = path.join(outDir, `${packageName}.js`);
  const cmd = `cargo build --target=${rustTarget}${release ? ' --release' : ''}`;

  const self = this;
  child_process.exec(cmd, { cwd: this.context }, function(error, stdout, stderr) {
    if (error) { return callback(error, null); }

    const out = fs.readFileSync(outFile, 'utf8');

    if (target === 'wasm32') {
      const wasmFile = fs.readdirSync(path.join(outDir, 'deps')).find(f => /\.wasm$/.test(f));
      if (!wasmFile) { return callback(new Error('No wasm file found', null)); }
      self.emitFile(`${opts.outName}.wasm`, fs.readFileSync(path.join(outDir, 'deps', wasmFile)));
      self.emitFile(`${opts.outName}.js`, out);
      return callback(null, '');
    }

    callback(null, `(function(){\n${out}\n})();`);
  });
};
