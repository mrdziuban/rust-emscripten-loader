const child_process = require('child_process');
const fs = require('fs');
const path = require('path');
const toml = require('toml');

module.exports = function(source) {
  const callback = this.async();
  const srcDir = path.dirname(path.dirname(this.resourcePath));
  const packageName = toml.parse(fs.readFileSync(path.join(srcDir, 'Cargo.toml'), 'utf8').toString()).package.name;

  const release = typeof this.query === 'string'
    ? /(\?|&)release(=true)?/.test(this.query)
    : this.query.release;
  const outFile = path.join(srcDir, 'target', 'asmjs-unknown-emscripten', (release ? 'release' : 'debug'), `${packageName}.js`);
  const cmd = `cargo build --target=asmjs-unknown-emscripten${release ? ' --release' : ''}`;

  child_process.exec(cmd, { cwd: this.context }, function(error, stdout, stderr) {
    if (error) { return callback(error, null); }
    const out = fs.readFileSync(outFile, 'utf8').toString();
    callback(null, `(function(){\n${out}\n})();`);
  });
};
