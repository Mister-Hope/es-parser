import * as ESTree from 'estree';
import * as acorn from 'acorn';
import { Scope } from './scope';

import evaluate from './eval';

const options: acorn.Options = {
  ecmaVersion: 6,
  sourceType: 'script',
  locations: true
};

declare const Promise: any;

// 导出默认对象
const defaultApi: { [key: string]: any } = {
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
  Promise
};

export const run = (code: string, appendApi: { [key: string]: any } = {}) => {
  const scope = new Scope('block');
  // eslint-disable-next-line no-invalid-this
  scope.const('this', this);

  for (const name of Object.getOwnPropertyNames(defaultApi))
    scope.const(name, defaultApi[name]);

  for (const name of Object.getOwnPropertyNames(appendApi))
    scope.const(name, appendApi[name]);

  // 定义 module
  const $exports = {};
  const $module = { exports: $exports };
  scope.const('module', $module);
  scope.const('exports', $exports);

  evaluate((acorn.parse(code, options) as unknown) as ESTree.Node, scope);

  // exports
  const moduleVar = scope.find('module');
  return moduleVar ? moduleVar.get().exports : null;
};

export default {
  run
};
