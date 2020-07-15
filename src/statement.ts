/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-continue */
/* eslint-disable consistent-return */
import * as ESTree from "estree";
import { Break, Continue, Return, handleDeclaration } from "./common";
import { Scope } from "./scope";
import evaluate from "./eval";

const statementHandler = {
  /** 表达式 */
  ExpressionStatement: (
    node: ESTree.ExpressionStatement,
    scope: Scope
  ): void => {
    // 直接执行表达式
    evaluate(node.expression, scope);
  },

  /** 块表达式 */
  BlockStatement: (
    block: ESTree.BlockStatement,
    scope: Scope
  ): Break | Continue | Return | void => {
    // 需要生成新的块作用域
    const blockScope = new Scope("block", scope);

    handleDeclaration(block.body, blockScope);

    // 执行块的主体，并做相应返回
    for (const node of block.body)
      if (node.type !== "FunctionDeclaration") {
        const result = evaluate(node, blockScope);

        if (
          result instanceof Break ||
          result instanceof Continue ||
          result instanceof Return
        )
          return result;
      }

    return undefined;
  },

  /** 空表达式 */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  EmptyStatement: (_node: ESTree.EmptyStatement, _scope: Scope): void => {},

  /** debugger 表达式 */
  DebuggerStatement: (_node: ESTree.DebuggerStatement, _scope: Scope): void => {
    debugger;
  },

  /** with 表达式 */
  WithStatement: (_node: ESTree.WithStatement, _scope: Scope): void => {
    throw new SyntaxError("'with' not supported in strict mode");
  },

  /** 返回表达式 */
  ReturnStatement: (node: ESTree.ReturnStatement, scope: Scope): Return => {
    return new Return(
      node.argument ? evaluate(node.argument, scope) : undefined
    );
  },

  /** 标签表达式 */
  LabeledStatement: (node: ESTree.LabeledStatement, scope: Scope): any =>
    evaluate(
      node.body,
      new Scope("block", scope, {
        __label__: node.label.name,
      })
    ),

  /** break 语句 */
  BreakStatement: (node: ESTree.BreakStatement, _scope: Scope): Break =>
    new Break(node.label?.name || undefined),

  /** continue 语句 */
  ContinueStatement: (
    node: ESTree.ContinueStatement,
    _scope: Scope
  ): Continue => new Continue(node.label?.name || undefined),

  IfStatement: (node: ESTree.IfStatement, scope: Scope): void => {
    if (evaluate(node.test, scope)) return evaluate(node.consequent, scope);
    else if (node.alternate) return evaluate(node.alternate, scope);
  },

  SwitchStatement: (
    node: ESTree.SwitchStatement,
    scope: Scope
  ): Continue | Return | void => {
    const discriminant = evaluate(node.discriminant, scope);
    const newScope = new Scope("switch", scope);

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

        if (result instanceof Break) break;
        else if (result instanceof Continue || result instanceof Return)
          return result;
      }
    }

    return undefined;
  },

  ThrowStatement: (node: ESTree.ThrowStatement, scope: Scope): void => {
    throw evaluate(node.argument, scope);
  },

  TryStatement: (node: ESTree.TryStatement, scope: Scope): any => {
    try {
      return evaluate(node.block, scope);
    } catch (err) {
      if (node.handler) {
        const param = node.handler.param as ESTree.Identifier;
        const newScope = new Scope("block", scope);
        newScope.const(param.name, err);
        return evaluate(node.handler, newScope);
      }
      throw err;
    } finally {
      // eslint-disable-next-line no-unsafe-finally
      if (node.finalizer) return evaluate(node.finalizer, scope);
    }
  },

  WhileStatement: (
    node: ESTree.WhileStatement,
    scope: Scope
  ): Return | void => {
    while (evaluate(node.test, scope)) {
      const newScope = new Scope("loop", scope);
      const result = evaluate(node.body, newScope);

      if (result instanceof Break) break;
      else if (result instanceof Continue) continue;
      else if (result instanceof Return) return result;
    }

    return undefined;
  },

  DoWhileStatement: (
    node: ESTree.DoWhileStatement,
    scope: Scope
  ): Return | void => {
    do {
      const newScope = new Scope("loop", scope);
      const result = evaluate(node.body, newScope);

      if (result instanceof Break) break;
      else if (result instanceof Continue) continue;
      else if (result instanceof Return) return result;
    } while (evaluate(node.test, scope));

    return undefined;
  },

  ForStatement: (node: ESTree.ForStatement, scope: Scope): Return | void => {
    for (
      const newScope = new Scope("loop", scope),
        // eslint-disable-next-line sort-vars
        initVal = node.init ? evaluate(node.init, newScope) : null;
      node.test ? evaluate(node.test, newScope) : true;
      // eslint-disable-next-line no-void
      node.update ? evaluate(node.update, newScope) : void 0
    ) {
      const result = evaluate(node.body, newScope);

      if (result instanceof Break) break;
      else if (result instanceof Continue) continue;
      else if (result instanceof Return) return result;
    }

    return undefined;
  },

  ForInStatement: (
    node: ESTree.ForInStatement,
    scope: Scope
  ): Return | void => {
    const { kind } = node.left as ESTree.VariableDeclaration;
    const decl = (node.left as ESTree.VariableDeclaration).declarations[0];
    const { name } = decl.id as ESTree.Identifier;

    // eslint-disable-next-line guard-for-in
    for (const value in evaluate(node.right, scope)) {
      const newScope = new Scope("loop", scope);

      scope.declare(kind, name, value);
      const result = evaluate(node.body, newScope);

      if (result instanceof Break) break;
      else if (result instanceof Continue) continue;
      else if (result instanceof Return) return result;
    }

    return undefined;
  },

  ForOfStatement: (node: ESTree.ForOfStatement, _scope: Scope): void => {
    throw new Error(`${node.type} 未实现`);
  },
};

export default statementHandler;
