/* eslint-disable max-classes-per-file */
/* eslint-disable no-underscore-dangle */
import * as ESTree from "estree";
import { Scope } from "./scope";
import evaluate from "./eval";

/** Break 标志 */
export class Break {
  constructor(public label?: string) {}
}

/** Continue 标志 */
export class Continue {
  constructor(public label?: string) {}
}

/** Return 标志 */
export class Return {
  constructor(public result: any) {}
}

/** 获得代码位置 */
export const getStack = (
  node: ESTree.Node,
  type: "start" | "end" = "start"
): string => {
  const loc = node.loc?.[type];

  return loc ? `\n    at ${loc.line}:${loc.column}` : "";
};

/** 获得 this */
export const getThis = (scope: Scope): any =>
  scope.this || (scope.parent ? getThis(scope.parent) : null);

/** 获取函数内容 */
export const getFunction = (
  node: ESTree.BaseFunction,
  scope: Scope,
  isArrow = false
) =>
  // eslint-disable-next-line @typescript-eslint/naming-convention
  function Function(...args: any[]): Return | void {
    /** 函数作用域 */
    const functionScope = new Scope(
      "function",
      scope,
      // 普通函数获得当前this，箭头函数获得父级的 this 表达式
      isArrow ? getThis(scope) : this
    );

    // 在函数作用域内声明函数参数
    node.params.forEach((element, index) => {
      const paramName = (element as ESTree.Identifier).name;
      functionScope.let(paramName, args[index]);
    });

    // 声明 arguments
    functionScope.const("arguments", args);

    // 解析函数体
    const result = evaluate(node.body, functionScope);

    // 如果函数体存在返回值，则返回
    if (result instanceof Return) return result.result;
  };

/** 额外处理声明 */
export const handleDeclaration = (
  nodes: (ESTree.Directive | ESTree.Statement | ESTree.ModuleDeclaration)[],
  scope: Scope
): void => {
  // 先将 var 变量声明为 undefined
  for (const node of nodes)
    if (node.type === "VariableDeclaration" && node.kind === "var")
      // 依次声明变量
      for (const declarator of node.declarations)
        scope.declare(
          "var",
          /** 变量名称 */
          (declarator.id as ESTree.Identifier).name,
          undefined
        );

  // 再执行函数声明
  for (const node of nodes)
    if (node.type === "FunctionDeclaration") evaluate(node, scope);
};

/** 返回正确的成员 */
export const getMember = (node: ESTree.MemberExpression, scope: Scope): any => {
  /** 解析得到的所在对象 */
  const object = evaluate(node.object, scope);
  /** 对应的属性名称 */
  const property =
    // 是否需要计算
    node.computed
      ? evaluate(node.property, scope)
      : (node.property as ESTree.Identifier).name;

  /** 真正的对象 */
  const realObject =
    typeof object === "function" &&
    object.__props__ &&
    object[property] === undefined
      ? object.__props__
      : object;

  return [realObject, property];
};

/** 返回正确的成员值 */
export const getMemberVariable = (
  node: ESTree.MemberExpression,
  scope: Scope
): any => {
  const [realObject, property] = getMember(node, scope);

  // 生成变量对象
  return {
    get value(): any {
      return realObject[property];
    },
    set value(value: any) {
      realObject[property] = value;
    },
  };
};
