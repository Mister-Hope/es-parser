/* eslint-disable @typescript-eslint/naming-convention */
import * as ESTree from "estree";
import { Scope } from "./scope";
import { evaluate } from "./eval";
import { parse } from "./parse";

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

  evaluate(parse(code) as unknown as ESTree.Node, scope);

  // exports
  return scope.getValue("module").exports;
};
