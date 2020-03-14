/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-continue */
/* eslint-disable consistent-return */
import * as ESTree from 'estree';
import { BREAK, CONTINUE, RETURN_SINGAL } from './common';
import { Scope } from './scope';
import evaluate from './eval';

const statementHandler = {
  /** 表达式 */
  ExpressionStatement: (node: ESTree.ExpressionStatement, scope: Scope) => {
    // 直接执行表达式
    evaluate(node.expression, scope);
  },

  /** 块表达式 */
  BlockStatement: (block: ESTree.BlockStatement, scope: Scope) => {
    // 需要生成新的块作用域
    const blockScope = new Scope('block', scope);

    // 先执行函数声明
    /*
     * for (const node of block.body)
     *   if (node.type === 'FunctionDeclaration') evaluate(node, scope);
     */

    // 执行块的主体，并做相应返回
    /*
     * for (const node of block.body)
     *   if (node.type !== 'FunctionDeclaration') {
     *     const result = evaluate(node, blockScope);
     *
     *     if (
     *       result === BREAK_SINGAL ||
     *       result === CONTINUE_SINGAL ||
     *       result === RETURN_SINGAL
     *     )
     *       return result;
     *   }
     */

    // 执行块的主体，并做相应返回
    for (const node of block.body) {
      const result = evaluate(node, blockScope);

      if (result === BREAK || result === CONTINUE || result === RETURN_SINGAL)
        return result;
    }
  },

  /** 空表达式 */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  EmptyStatement: (_node: ESTree.EmptyStatement, _scope: Scope) => {},

  /** debugger 表达式 */
  DebuggerStatement: (_node: ESTree.DebuggerStatement, _scope: Scope) => {
    debugger;
  },

  /** with 表达式 */
  WithStatement: (_node: ESTree.WithStatement, _scope: Scope) => {
    throw new SyntaxError("'with' not supported in strict mode");
  },

  ReturnStatement: (node: ESTree.ReturnStatement, scope: Scope) => {
    RETURN_SINGAL.result = node.argument
      ? evaluate(node.argument, scope)
      : undefined;
    return RETURN_SINGAL;
  },

  LabeledStatement: (node: ESTree.LabeledStatement, _scope: Scope) => {
    console.error(`${node.type} 未实现`);
    // throw new Error(`${node.type} 未实现`);
  },

  BreakStatement: (_node: ESTree.BreakStatement, _scope: Scope) => BREAK,

  ContinueStatement: (_node: ESTree.ContinueStatement, _scope: Scope) =>
    CONTINUE,

  IfStatement: (node: ESTree.IfStatement, scope: Scope) => {
    if (evaluate(node.test, scope)) return evaluate(node.consequent, scope);
    else if (node.alternate) return evaluate(node.alternate, scope);
  },

  SwitchStatement: (node: ESTree.SwitchStatement, scope: Scope) => {
    const discriminant = evaluate(node.discriminant, scope);
    const newScope = new Scope('switch', scope);

    let matched = false;
    for (const $case of node.cases) {
      // 进行匹配相应的 case
      if (
        !matched &&
        (!$case.test || discriminant === evaluate($case.test, newScope))
      )
        matched = true;

      if (matched) {
        const result = evaluate($case, newScope);

        if (result === BREAK) break;
        else if (result === CONTINUE || result === RETURN_SINGAL) return result;
      }
    }
  },

  ThrowStatement: (node: ESTree.ThrowStatement, scope: Scope) => {
    throw evaluate(node.argument, scope);
  },

  TryStatement: (node: ESTree.TryStatement, scope: Scope) => {
    try {
      return evaluate(node.block, scope);
    } catch (err) {
      if (node.handler) {
        const param = node.handler.param as ESTree.Identifier;
        const newScope = new Scope('block', scope);
        newScope.const(param.name, err);
        return evaluate(node.handler, newScope);
      }
      throw err;
    } finally {
      // eslint-disable-next-line no-unsafe-finally
      if (node.finalizer) return evaluate(node.finalizer, scope);
    }
  },

  WhileStatement: (node: ESTree.WhileStatement, scope: Scope) => {
    while (evaluate(node.test, scope)) {
      const newScope = new Scope('loop', scope);
      const result = evaluate(node.body, newScope);

      if (result === BREAK) break;
      else if (result === CONTINUE) continue;
      else if (result === RETURN_SINGAL) return result;
    }
  },

  DoWhileStatement: (node: ESTree.DoWhileStatement, scope: Scope) => {
    do {
      const newScope = new Scope('loop', scope);
      const result = evaluate(node.body, newScope);
      if (result === BREAK) break;
      else if (result === CONTINUE) continue;
      else if (result === RETURN_SINGAL) return result;
    } while (evaluate(node.test, scope));
  },

  ForStatement: (node: ESTree.ForStatement, scope: Scope) => {
    for (
      const newScope = new Scope('loop', scope),
        // eslint-disable-next-line sort-vars
        initVal = node.init ? evaluate(node.init, newScope) : null;
      node.test ? evaluate(node.test, newScope) : true;
      // eslint-disable-next-line no-void
      node.update ? evaluate(node.update, newScope) : void 0
    ) {
      const result = evaluate(node.body, newScope);
      if (result === BREAK) break;
      else if (result === CONTINUE) continue;
      else if (result === RETURN_SINGAL) return result;
    }
  },

  ForInStatement: (node: ESTree.ForInStatement, scope: Scope) => {
    const { kind } = node.left as ESTree.VariableDeclaration;
    const decl = (node.left as ESTree.VariableDeclaration).declarations[0];
    const { name } = decl.id as ESTree.Identifier;

    // eslint-disable-next-line guard-for-in
    for (const value in evaluate(node.right, scope)) {
      const newScope = new Scope('loop', scope);

      scope.declare(kind, name, value);
      const result = evaluate(node.body, newScope);
      if (result === BREAK) break;
      else if (result === CONTINUE) continue;
      else if (result === RETURN_SINGAL) return result;
    }
  },

  ForOfStatement: (node: ESTree.ForOfStatement, _scope: Scope) => {
    throw new Error(`${node.type} 未实现`);
  }
};

export default statementHandler;
