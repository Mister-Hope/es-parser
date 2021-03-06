import * as ESTree from "estree";
import { getFunction, getMember, getMemberVariable, getThis } from "./common";
import { Scope } from "./scope";
import { Variable } from "./variable";
import { evaluate } from "./eval";
import { errorGenerator } from "./utils";

/** `this` 表达式 */
export const ThisExpression = (
  _node: ESTree.ThisExpression,
  scope: Scope
): any => getThis(scope);

/** 数组表达式 */
export const ArrayExpression = (
  node: ESTree.ArrayExpression,
  scope: Scope
): any[] =>
  //  遍历执行每个元素并返回
  node.elements.map((item) => (item ? evaluate(item, scope) : null));

/** 对象表达式 */
export const ObjectExpression = (
  node: ESTree.ObjectExpression,
  scope: Scope
): Record<any, any> => {
  const object: Record<any, any> = {};

  // 遍历对象属性
  for (const property of node.properties)
    if (property.type === "Property") {
      const { kind } = property;
      let propertyName;

      switch (property.key.type) {
        case "Literal":
          propertyName = evaluate(property.key, scope);
          break;
        case "Identifier":
          propertyName = property.key.name;
          break;
        default:
          errorGenerator(property.key.type);
      }

      // 获得对应的值
      const value = evaluate(property.value, scope);
      switch (kind) {
        // 普通属性
        case "init":
          object[propertyName] = value;
          break;

        // Getter
        case "get":
          Object.defineProperty(object, propertyName, { get: value });
          break;

        // Setter
        case "set":
          // eslint-disable-next-line accessor-pairs
          Object.defineProperty(object, propertyName, { set: value });
          break;
        default:
      }
    }

  return object;
};

/** 函数表达式 */
export const FunctionExpression = (
  node: ESTree.FunctionExpression,
  scope: Scope
): any => getFunction(node, scope);

/** 箭头函数表达式 */
export const ArrowFunctionExpression = (
  node: ESTree.ArrowFunctionExpression,
  scope: Scope
): any => getFunction(node, scope, true);

/** yield 表达式 */
export const YieldExpression = (
  node: ESTree.YieldExpression,
  _scope: Scope
): any => {
  errorGenerator(node.type);
};

/** 一元运算 */
export const UnaryExpression = (
  node: ESTree.UnaryExpression,
  scope: Scope
): any =>
  ({
    "-": (): any => -evaluate(node.argument, scope),
    "+": (): any => Number(evaluate(node.argument, scope)),
    "!": (): any => !evaluate(node.argument, scope),
    "~": (): any => ~evaluate(node.argument, scope),
    void: (): void => void evaluate(node.argument, scope),
    typeof: (): string => {
      if (node.argument.type === "Identifier")
        try {
          return typeof scope.getValue(node.argument.name);
        } catch (err) {
          return "undefined";
        }

      return typeof evaluate(node.argument, scope);
    },
    delete: (): boolean => {
      switch (node.argument.type) {
        case "MemberExpression": {
          const [realObject, property] = getMember(node.argument, scope);

          return delete realObject[property];
        }

        case "Identifier": {
          const ctx = getThis(scope);

          return ctx ? ctx.value[node.argument.name] : false;
        }

        default:
          return false;
      }
    },
  }[node.operator]());

/** 自增自减运算 */
export const UpdateExpression = (
  node: ESTree.UpdateExpression,
  scope: Scope
): any => {
  const { prefix } = node;
  let variable: Variable;

  if (node.argument.type === "Identifier")
    variable = scope.get(node.argument.name);
  else if (node.argument.type === "MemberExpression")
    variable = getMemberVariable(node.argument, scope);

  return {
    "--": (a: any): number => {
      variable.value = a - 1;

      return prefix ? --a : a--;
    },
    "++": (a: any): number => {
      variable.value = (a as number) + 1;

      return prefix ? ++a : a++;
    },
  }[node.operator](evaluate(node.argument, scope));
};

/** 二元运算 */
export const BinaryExpression = (
  node: ESTree.BinaryExpression,
  scope: Scope
): any =>
  ({
    "==": (a: any, b: any): boolean => a == b,
    "!=": (a: any, b: any): boolean => a != b,
    "===": (a: any, b: any): boolean => a === b,
    "!==": (a: any, b: any): boolean => a !== b,
    "<": (a: any, b: any): boolean => a < b,
    "<=": (a: any, b: any): boolean => a <= b,
    ">": (a: any, b: any): boolean => a > b,
    ">=": (a: any, b: any): boolean => a >= b,
    "<<": (a: any, b: any): number => a << b,
    ">>": (a: any, b: any): number => a >> b,
    ">>>": (a: any, b: any): number => a >>> b,
    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
    "+": (a: any, b: any): any => a + b,
    "-": (a: any, b: any): number => a - b,
    "*": (a: any, b: any): number => a * b,
    "**": (a: any, b: any): number => a ** b,
    "/": (a: any, b: any): number => a / b,
    "%": (a: any, b: any): number => a % b,
    "|": (a: any, b: any): number => a | b,
    "^": (a: any, b: any): number => a ^ b,
    "&": (a: any, b: any): number => a & b,
    in: (a: any, b: any): boolean => a in b,
    instanceof: (a: any, b: any): boolean => a instanceof b,
  }[node.operator](evaluate(node.left, scope), evaluate(node.right, scope)));

/** 赋值表达式 */
export const AssignmentExpression = (
  node: ESTree.AssignmentExpression,
  scope: Scope
): any => {
  let variable: Variable;

  // 普通标识符
  if (node.left.type === "Identifier") variable = scope.get(node.left.name);
  // 成员表达式
  else if (node.left.type === "MemberExpression")
    variable = getMemberVariable(node.left, scope);
  else throw new TypeError(`Can not assign to type ${node.left.type}`);

  return {
    "=": (a: any): any => (variable.value = a),
    "+=": (a: any): any => (variable.value += a),
    "-=": (a: any): number => (variable.value -= a),
    "*=": (a: any): number => (variable.value *= a),
    "/=": (a: any): number => (variable.value /= a),
    "%=": (a: any): number => (variable.value %= a),
    "<<=": (a: any): number => (variable.value <<= a),
    ">>=": (a: any): number => (variable.value >>= a),
    ">>>=": (a: any): number => (variable.value >>>= a),
    "**=": (a: any): number => (variable.value **= a),
    "|=": (a: any): number => (variable.value |= a),
    "^=": (a: any): number => (variable.value ^= a),
    "&=": (a: any): number => (variable.value &= a),
  }[node.operator](evaluate(node.right, scope));
};

/** 逻辑表达式 */
export const LogicalExpression = (
  node: ESTree.LogicalExpression,
  scope: Scope
): any =>
  ({
    "||": (): any => evaluate(node.left, scope) || evaluate(node.right, scope),
    "&&": (): any => evaluate(node.left, scope) && evaluate(node.right, scope),
    "??": (): any => evaluate(node.left, scope) ?? evaluate(node.right, scope),
  }[node.operator]());

/** 成员表达式 */
export const MemberExpression = (
  node: ESTree.MemberExpression,
  scope: Scope
): any => {
  const [realObject, property] = getMember(node, scope);

  return realObject[property];
};

/** 三元表达式 */
export const ConditionalExpression = (
  node: ESTree.ConditionalExpression,
  scope: Scope
): any =>
  evaluate(node.test, scope)
    ? evaluate(node.consequent, scope)
    : evaluate(node.alternate, scope);

/** call 表达式 */
export const CallExpression = (
  node: ESTree.CallExpression,
  scope: Scope
): any => {
  const func = evaluate(node.callee, scope);
  const args = node.arguments.map((argument) => evaluate(argument, scope));

  return node.callee.type === "MemberExpression"
    ? // 成员表达式，this 为调用它的对象
      // eslint-disable-next-line @typescript-eslint/ban-types
      (func as Function).apply(evaluate(node.callee.object, scope), args)
    : // 获取函数运行环境的 this
      // eslint-disable-next-line @typescript-eslint/ban-types
      (func as Function).apply(getThis(scope)?.value || null, args);
};

/** new 表达式 */
export const NewExpression = (
  node: ESTree.NewExpression,
  scope: Scope
): any => {
  const func = evaluate(node.callee, scope);

  // eslint-disable-next-line
  return new ((func as Function).bind.apply(
    func,
    // 生成 arguments 数组
    [null].concat(
      node.arguments.map((argument) => evaluate(argument, scope))
    ) as [any, ...any[]]
  ))();
};

export const SequenceExpression = (
  node: ESTree.SequenceExpression,
  scope: Scope
): any => {
  let last;

  for (const expr of node.expressions) last = evaluate(expr, scope);

  return last;
};

export const TemplateLiteral = (
  node: ESTree.TemplateLiteral,
  _scope: Scope
): void => {
  errorGenerator(node.type);
};

export const TaggedTemplateExpression = (
  node: ESTree.TaggedTemplateExpression,
  _scope: Scope
): void => {
  errorGenerator(node.type);
};

export const ClassExpression = (
  node: ESTree.ClassExpression,
  _scope: Scope
): void => {
  errorGenerator(node.type);
};

export const MetaProperty = (
  node: ESTree.MetaProperty,
  _scope: Scope
): void => {
  errorGenerator(node.type);
};

export const AwaitExpression = (
  node: ESTree.AwaitExpression,
  _scope: Scope
): void => {
  // TODO: Support it
  errorGenerator(node.type);
};

export const ChainExpression = (
  node: ESTree.ChainExpression,
  _scope: Scope
): void => {
  errorGenerator(node.type);
};
