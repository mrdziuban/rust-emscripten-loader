module.exports = {
  entry: {
    asmjs: './src/asm.js',
    wasm: './src/wasm.js'
  },
  output: { filename: 'bundle/[name].js' },
  module: {
    rules: [
      { test: /\.rs$/, loader: 'rust-emscripten-loader' }
    ]
  },
  node: { fs: 'empty' }
}
