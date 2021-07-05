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
} from "./expression";
import {
  MethodDefinition,
  ImportDeclaration,
  ImportSpecifier,
  ImportDefaultSpecifier,
  ImportNamespaceSpecifier,
  ExportNamedDeclaration,
  ExportAllDeclaration,
  ExportDefaultDeclaration,
  ExportSpecifier,
} from "./module";
import patternHandler from "./pattern";
import statementHandler from "./statement";

/** 操作列表 */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
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

  VariableDeclarator: (_node: ESTree.VariableDeclarator, _scope: Scope) => {
    throw new Error("不应出现");
  },

  Property: (_node: ESTree.Property, _scope: Scope, _computed: boolean) => {
    throw new Error("不应出现");
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
  MethodDefinition,
  ImportDeclaration,
  ImportSpecifier,
  ImportDefaultSpecifier,
  ImportNamespaceSpecifier,
  ExportNamedDeclaration,
  ExportAllDeclaration,
  ExportDefaultDeclaration,
  ExportSpecifier,
  ...patternHandler,
  ...statementHandler,
};

/** 执行操作 */
export const evaluate = (node: ESTree.Node, scope: Scope, arg?: any): any =>
  (evaluateMap[node.type] as EvaluateFunc)(node, scope, arg);
