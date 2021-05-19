import * as webpack from "webpack";

export = {
  target: "node",
  mode: "production",
  entry: "./src/index.ts",
  output: {
    filename: "parser.js",
    libraryTarget: "commonjs",
  },
  devtool: "source-map",
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [{ test: /\.ts$/u, loader: "ts-loader" }],
  },
} as webpack.Configuration;
