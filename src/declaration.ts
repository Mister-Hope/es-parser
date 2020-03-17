/* eslint-disable @typescript-eslint/no-unused-vars */
import * as ESTree from 'estree';
import { Scope } from './scope';
import evaluate from './eval';
import { getFunction } from './common';

/** 声明处理 */
const declarationHandler = {
  /** 变量声明 */
  VariableDeclaration: (node: ESTree.VariableDeclaration, scope: Scope) => {
    // 依次声明变量
    for (const declarator of node.declarations)
      scope.declare(
        /** 声明类型 */
        node.kind,
        /** 变量名称 */
        (declarator.id as ESTree.Identifier).name,
        /** 变量值 */
        declarator.init ? evaluate(declarator.init, scope) : undefined
      );
  },

  /** 函数声明 */
  FunctionDeclaration: (node: ESTree.FunctionDeclaration, scope: Scope) => {
    // `export default function` 时为 `null`
    if (node.id)
      scope.declare('function', node.id.name, () => getFunction(node, scope));
  },

  /** 类声明 */
  ClassDeclaration: (_node: ESTree.ClassDeclaration, _scope: Scope) => {
    // 小程序环境不支持
    throw new Error('Class not supported in Wechat Miniprogram');
  }
};

export default declarationHandler;
