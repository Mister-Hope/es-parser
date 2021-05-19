import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";
import { terser } from "rollup-plugin-terser";

export default [
  {
    input: `./src/index.ts`,
    output: [{ file: `./dist/parser.js`, format: "cjs", sourcemap: "true" }],
    plugins: [typescript(), nodeResolve(), commonjs(), terser()],
    context: "this",
  },
  {
    input: `./src/index.ts`,
    output: [{ file: `./dist/parser.d.ts`, format: "esm" }],
    plugins: [dts()],
  },
];
