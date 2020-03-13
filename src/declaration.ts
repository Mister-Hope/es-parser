/* eslint-disable @typescript-eslint/no-unused-vars */
import * as ESTree from 'estree';
import { Scope } from './scope';
import evaluate from './eval';
import { getFuntionExpression } from './expression';

const declarationHandler = {
  /** 变量声明 */
  VariableDeclaration: (node: ESTree.VariableDeclaration, scope: Scope) => {
    // 依次声明变量
    for (const declartor of node.declarations) {
      /** 变量名称 */
      const varName = (declartor.id as ESTree.Identifier).name;
      /** 变量值 */
      const value = declartor.init
        ? evaluate(declartor.init, scope)
        : undefined;

      scope.declare(node.kind, varName, value);
    }
  },

  /** 函数声明 */
  FunctionDeclaration: (node: ESTree.FunctionDeclaration, scope: Scope) => {
    // `export default function` 时为 `null`
    if (node.id) scope.const(node.id.name, getFuntionExpression(node, scope));
  },

  /** 类声明 */
  ClassDeclaration: (_node: ESTree.ClassDeclaration, _scope: Scope) => {
    // 小程序环境不支持
    throw new Error('Class not supported in Wechat Miniprogram');
  }
};

export default declarationHandler;
