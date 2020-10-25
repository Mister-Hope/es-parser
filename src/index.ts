/* eslint-disable @typescript-eslint/naming-convention */
import * as ESTree from "estree";
import * as acorn from "acorn";
import { Scope } from "./scope";

import evaluate from "./eval";

const options: acorn.Options = {
  ecmaVersion: 6,
  sourceType: "script",
  locations: true,
};

// 导出默认对象
const globalVar: { [key: string]: any } = {
  console,

  setTimeout,
  setInterval,

  clearTimeout,
  clearInterval,

  encodeURI,
  encodeURIComponent,
  decodeURI,
  decodeURIComponent,
  escape,
  unescape,
  parseFloat,
  parseInt,

  Error,
  EvalError,
  RangeError,
  ReferenceError,
  SyntaxError,
  TypeError,
  URIError,

  Symbol,
  Object,
  Boolean,
  Function,
  Number,
  Math,
  Date,
  String,
  RegExp,
  Array,
  JSON,
  Promise,
  Infinity,
};

/** 解析代码 */
export const parse = (code: string): acorn.Node => acorn.parse(code, options);

/** 运行代码 */
export const run = (
  code: string,
  addtionalGlobalVar: Record<string, any> = {}
): any => {
  // eslint-disable-next-line no-invalid-this
  const scope = new Scope("block", undefined, this);

  // 定义默认全局变量
  for (const name of Object.getOwnPropertyNames(globalVar))
    scope.const(name, globalVar[name]);

  // 定义自定义全局变量
  for (const name of Object.getOwnPropertyNames(addtionalGlobalVar))
    scope.const(name, addtionalGlobalVar[name]);

  // 定义 module
  const $exports = {};
  const $module = { exports: $exports };
  scope.const("module", $module);
  scope.const("exports", $exports);

  evaluate((parse(code) as unknown) as ESTree.Node, scope);

  // exports
  return scope.getValue("module").exports;
};

export default {
  parse,
  run,
};
