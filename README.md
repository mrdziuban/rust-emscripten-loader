# Rust Webpack loader

[![npm](https://img.shields.io/npm/v/rust-emscripten-loader.svg)](https://www.npmjs.com/package/rust-emscripten-loader)

### Usage

This is a simple Webpack loader that shells out to cargo to build a Rust project targeting either asm.js or
WebAssembly. See [this post](https://users.rust-lang.org/t/compiling-to-the-web-with-rust-and-emscripten/7627) for
more details on using Rust to target the web.

To use it, first install the package:

```bash
$ npm install --save rust-emscripten-loader
```

then configure the loader in your Webpack config:

```js
module.exports = {
  // ...
  module: {
    rules: [
      { test: /\.rs$/, loader: 'rust-emscripten-loader' },
      // ...
    ]
  }
}
```

Make sure you have the `cargo`, `rustc`, and `emsdk` binaries somewhere in your `PATH`.

When targeting WebAssembly, the loader will emit two additional files: one `.wasm` and one `.js`. You must specify
the `outName` option to tell the loader how to name these files, and you'll need to load them info your HTML page in
order to run the code. Check out the configuration and example sections below for more details.

### Configuration

The following options can be added to the Webpack loader query:

| Name | Description | Required | Default |
| ---- | ----------- | -------- | ------- |
| `release` | Whether or not to pass the `--release` flag to cargo | false | false |
| `target` | The output target of the cargo build. Available options are `asmjs` and `wasm`. | false | `asmjs` |
| `outName` | The name of the output file for the `wasm` and `js` files when targeting `wasm` | Only when target is `wasm` | none |

### Example

Check out the [example](example) directory for a simple Hello World example targeting both asm.js and WebAssembly.
