module.exports = {
  target: 'node',
  // mode: 'production',
  entry: './src/index.ts',
  output: {
    filename: 'parser.js',
    path: __dirname + '/dist/',
    libraryTarget: 'commonjs'
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.ts', '.js', '.json']
  },
  module: {
    rules: [{ test: /\.ts$/, loader: 'ts-loader' }]
  }
};
