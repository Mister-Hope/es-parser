import * as ESTree from "estree";
import { handleDeclaration } from "./common";
import { EvaluateFunc, EvaluateMap } from "./type";
import { Scope } from "./scope";
import { isBreak, isContinue, isReturn } from "./singal";
import {
  ClassDeclaration,
  FunctionDeclaration,
  VariableDeclaration,
} from "./declaration";
import {
  ThisExpression,
  ArrayExpression,
  ObjectExpression,
  FunctionExpression,
  ArrowFunctionExpression,
  YieldExpression,
  UnaryExpression,
  UpdateExpression,
  BinaryExpression,
  AssignmentExpression,
  LogicalExpression,
  MemberExpression,
  ConditionalExpression,
  CallExpression,
  NewExpression,
  SequenceExpression,
  TemplateLiteral,
  TaggedTemplateExpression,
  ClassExpression,
  MetaProperty,
  AwaitExpression,
  ChainExpression,
} from "./expression";
import { moduleHandler } from "./module";
import patternHandler from "./pattern";
import statementHandler from "./statement";
import { errorGenerator } from "./utils";

/** 操作列表 */

const evaluateMap: EvaluateMap = {
  /** 标识符 */
  Identifier: (node: ESTree.Identifier, scope: Scope) =>
    // 处理 undefined
    node.name === "undefined" ? undefined : scope.getValue(node.name),

  /** 文字表达式 */
  Literal: (node: ESTree.Literal, _scope: Scope) => node.value,

  /** 程序表达式 */
  Program: (program: ESTree.Program, scope: Scope) => {
    handleDeclaration(program.body, scope);

    // 依次执行每一行
    for (const node of program.body)
      if (node.type !== "FunctionDeclaration") evaluate(node, scope);
  },

  /** switch 中的 case 表达式 */
  SwitchCase: (node: ESTree.SwitchCase, scope: Scope) => {
    // 逐行执行，直至遇到 `break`, `continue` 或 `return`
    for (const statement of node.consequent) {
      const result = evaluate(statement, scope);
      // 执行停止并返回相应状态
      if (isBreak(result) || isContinue(result) || isReturn(result))
        return result;
    }

    return undefined;
  },

  CatchClause: (node: ESTree.CatchClause, scope: Scope) =>
    evaluate(node.body, scope),

  VariableDeclarator: (node: ESTree.VariableDeclarator, _scope: Scope) => {
    errorGenerator(node.type);
  },

  Property: (node: ESTree.Property, _scope: Scope, _computed: boolean) => {
    errorGenerator(node.type);
  },

  Super: (node: ESTree.Super, _scope: Scope) => {
    errorGenerator(node.type);
  },

  TemplateElement: (node: ESTree.TemplateElement, _scope: Scope) => {
    errorGenerator(node.type);
  },

  SpreadElement: (node: ESTree.SpreadElement, _scope: Scope) => {
    errorGenerator(node.type);
  },

  ClassBody: (node: ESTree.ClassBody, _scope: Scope) => {
    errorGenerator(node.type);
  },

  ClassDeclaration,
  FunctionDeclaration,
  VariableDeclaration,
  ThisExpression,
  ArrayExpression,
  ObjectExpression,
  FunctionExpression,
  ArrowFunctionExpression,
  YieldExpression,
  UnaryExpression,
  UpdateExpression,
  BinaryExpression,
  AssignmentExpression,
  LogicalExpression,
  MemberExpression,
  ConditionalExpression,
  CallExpression,
  NewExpression,
  SequenceExpression,
  TemplateLiteral,
  TaggedTemplateExpression,
  ClassExpression,
  MetaProperty,
  AwaitExpression,
  ChainExpression,

  PrivateIdentifier: (node: ESTree.PrivateIdentifier, _scope: Scope): void => {
    errorGenerator(node.type);
  },

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  PropertyDefinition: (
    node: ESTree.PropertyDefinition,
    _scope: Scope
  ): void => {
    errorGenerator(node.type);
  },
  ...moduleHandler,
  ...patternHandler,
  ...statementHandler,
};

/** 执行操作 */
export const evaluate = (node: ESTree.Node, scope: Scope, arg?: any): any =>
  (evaluateMap[node.type] as EvaluateFunc)(node, scope, arg);
