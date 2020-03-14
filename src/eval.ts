/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-continue */
/* eslint-disable consistent-return */
import * as ESTree from 'estree';
import { BREAK, CONTINUE, RETURN_SINGAL } from './common';
import { EvaluateFunc, EvaluateMap } from './type';
import { Scope } from './scope';
import declarationHandler from './declaration';
import expressionHandler from './expression';
import moduleHandler from './module';
import patternHandler from './pattern';
import statementHandler from './statement';

/** 操作列表 */
// eslint-disable-next-line prefer-const
let evaluateMap: EvaluateMap;

/*
 * const checkNodeType = (type: string) => {
 *   if (!Object.keys(evaluateMap).includes(type)) console.log(type);
 * };
 */

/*
 * const evaluate = (node: ESTree.Node, scope: Scope, arg?: any) => {
 *   checkNodeType(node.type);
 *   return (evaluateMap[node.type] as EvaluateFunc)(node, scope, arg);
 * };
 */

/** 执行操作 */
const evaluate = (node: ESTree.Node, scope: Scope, arg?: any) =>
  (evaluateMap[node.type] as EvaluateFunc)(node, scope, arg);

// eslint-disable-next-line prefer-object-spread
evaluateMap = Object.assign(
  {
    /** 标识符 */
    Identifier: (node: ESTree.Identifier, scope: Scope) => {
      // 处理 undefined
      if (node.name === 'undefined') return undefined;

      // 获取变量并返回其值
      return scope.get(node.name).value;
    },

    /** 文字表达式 */
    Literal: (node: ESTree.Literal, _scope: Scope) => node.value,

    /** 程序表达式 */
    Program: (program: ESTree.Program, scope: Scope) => {
      // 依次执行每一行，直到有返回值时返回，并停止执行
      for (const node of program.body) evaluate(node, scope);
      // 先执行函数声明
      /*
       * for (const node of program.body)
       *   if (node.type === 'FunctionDeclaration') evaluate(node, scope);
       */

      // 依次执行每一行
      /*
       * for (const node of program.body)
       *   if (node.type !== 'FunctionDeclaration') evaluate(node, scope);
       */
    },

    /** switch 中的 case 表达式 */
    SwitchCase: (node: ESTree.SwitchCase, scope: Scope) => {
      // 逐行执行，直至遇到 `break`, `continue` 或 `return`
      for (const statement of node.consequent) {
        const result = evaluate(statement, scope);
        // 执行停止并返回相应状态
        if (result === BREAK || result === CONTINUE || result === RETURN_SINGAL)
          return result;
      }
    },

    CatchClause: (node: ESTree.CatchClause, scope: Scope) => {
      return evaluate(node.body, scope);
    },

    VariableDeclarator: (_node: ESTree.VariableDeclarator, _scope: Scope) => {
      throw new Error('不应出现');
    },

    Property: (_node: ESTree.Property, _scope: Scope, _computed: boolean) => {
      throw new Error('不应出现');
    },

    Super: (node: ESTree.Super, _scope: Scope) => {
      throw new Error(`${node.type} 未实现`);
    },

    TemplateElement: (node: ESTree.TemplateElement, _scope: Scope) => {
      throw new Error(`${node.type} 未实现`);
    },

    SpreadElement: (node: ESTree.SpreadElement, _scope: Scope) => {
      throw new Error(`${node.type} 未实现`);
    },

    ClassBody: (node: ESTree.ClassBody, _scope: Scope) => {
      throw new Error(`${node.type} 未实现`);
    }
  },
  declarationHandler,
  expressionHandler,
  moduleHandler,
  patternHandler,
  statementHandler
);

export default evaluate;
