/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-bitwise */
import * as ESTree from 'estree';
import { Scope, Variable } from './scope';
import { getFunction, getThis } from './common';
import evaluate from './eval';

const expressionHandler = {
  /** `this` 表达式 */
  ThisExpression: (_node: ESTree.ThisExpression, scope: Scope) =>
    getThis(scope),

  /** 数组表达式 */
  ArrayExpression: (node: ESTree.ArrayExpression, scope: Scope) =>
    //  遍历执行每个元素并返回
    node.elements.map(item => evaluate(item, scope)),

  /** 对象表达式 */
  ObjectExpression: (node: ESTree.ObjectExpression, scope: Scope) => {
    const object: Record<any, any> = {};

    // 遍历对象属性
    for (const property of node.properties) {
      const { kind } = property;
      let propertyName;

      switch (property.key.type) {
        case 'Literal':
          propertyName = evaluate(property.key, scope);
          break;
        case 'Identifier':
          propertyName = property.key.name;
          break;
        default:
          // 暂不能处理该键值的对象 TODO: 完善
          throw new Error(
            `Can not handle object property in type '${property.key.type}'`
          );
      }

      // 获得对应的值
      const value = evaluate(property.value, scope);
      switch (kind) {
        // 普通属性
        case 'init':
          object[propertyName] = value;
          break;

        // Getter
        case 'get':
          Object.defineProperty(object, propertyName, { get: value });
          break;

        // Setter
        case 'set':
          // eslint-disable-next-line accessor-pairs
          Object.defineProperty(object, propertyName, { set: value });
          break;
        default:
      }
    }

    return object;
  },

  /** 函数表达式 */
  FunctionExpression: (node: ESTree.FunctionExpression, scope: Scope) =>
    getFunction(node, scope),

  /** 箭头函数表达式 */
  ArrowFunctionExpression: (
    node: ESTree.ArrowFunctionExpression,
    scope: Scope
  ) => getFunction(node, scope, true),

  /** yield 表达式 */
  YieldExpression: (_node: ESTree.YieldExpression, _scope: Scope) => {
    // 小程序环境不支持
    throw new Error('yield not supported in Wechat Miniprogram');
  },

  /** 一元运算 */
  UnaryExpression: (node: ESTree.UnaryExpression, scope: Scope) =>
    ({
      '-': () => -evaluate(node.argument, scope),
      '+': () => Number(evaluate(node.argument, scope)),
      '!': () => !evaluate(node.argument, scope),
      '~': () => ~evaluate(node.argument, scope),
      // eslint-disable-next-line no-void
      void: () => void evaluate(node.argument, scope),
      typeof: () => {
        if (node.argument.type === 'Identifier') {
          const variable = scope.find(node.argument.name);

          return variable === undefined ? 'undefined' : typeof variable.value;
        }

        return typeof evaluate(node.argument, scope);
      },
      delete: () => {
        if (node.argument.type === 'MemberExpression') {
          const { object, property, computed } = node.argument;

          if (computed)
            return delete evaluate(object, scope)[evaluate(property, scope)];

          return delete evaluate(object, scope)[
            (property as ESTree.Identifier).name
          ];
        } else if (node.argument.type === 'Identifier') {
          const ctx = getThis(scope);

          return ctx ? ctx.value[node.argument.name] : false;
        }

        return false;
      }
    }[node.operator]()),

  /** 自增自减运算 */
  UpdateExpression: (node: ESTree.UpdateExpression, scope: Scope) => {
    const { prefix } = node;
    let variable: Variable;

    if (node.argument.type === 'Identifier')
      variable = scope.get(node.argument.name);
    else if (node.argument.type === 'MemberExpression') {
      const { argument } = node;
      const object = evaluate(argument.object, scope);
      const property = argument.computed
        ? evaluate(argument.property, scope)
        : (argument.property as ESTree.Identifier).name;

      variable = {
        get value() {
          return object[property];
        },
        set value(value: any) {
          object[property] = value;
        }
      };
    }

    return {
      '--': (x: number) => {
        variable.value = x - 1;
        // eslint-disable-next-line
        return prefix ? --x : x--;
      },
      '++': (x: number) => {
        variable.value = x + 1;
        // eslint-disable-next-line
        return prefix ? ++x : x++;
      }
    }[node.operator](evaluate(node.argument, scope));
  },

  /** 二元运算 */
  BinaryExpression: (node: ESTree.BinaryExpression, scope: Scope) =>
    ({
      // eslint-disable-next-line eqeqeq
      '==': (x: any, y: any) => x == y,
      // eslint-disable-next-line eqeqeq
      '!=': (x: any, y: any) => x != y,
      '===': (x: any, y: any) => x === y,
      '!==': (x: any, y: any) => x !== y,
      '<': (x: any, y: any) => x < y,
      '<=': (x: any, y: any) => x <= y,
      '>': (x: any, y: any) => x > y,
      '>=': (x: any, y: any) => x >= y,
      '<<': (x: any, y: any) => x << y,
      '>>': (x: any, y: any) => x >> y,
      '>>>': (x: any, y: any) => x >>> y,
      '+': (x: any, y: any) => x + y,
      '-': (x: any, y: any) => x - y,
      '*': (x: any, y: any) => x * y,
      '**': (x: any, y: any) => x ** y,
      '/': (x: any, y: any) => x / y,
      '%': (x: any, y: any) => x % y,
      '|': (x: any, y: any) => x | y,
      '^': (x: any, y: any) => x ^ y,
      '&': (x: any, y: any) => x & y,
      in: (x: any, y: any) => x in y,
      instanceof: (x: any, y: any) => x instanceof y
    }[node.operator](evaluate(node.left, scope), evaluate(node.right, scope))),

  /** 赋值表达式 */
  AssignmentExpression: (node: ESTree.AssignmentExpression, scope: Scope) => {
    let variable: Variable;

    // 普通标识符
    if (node.left.type === 'Identifier') variable = scope.get(node.left.name);
    // 成员表达式
    else if (node.left.type === 'MemberExpression') {
      const { left } = node;
      // 获取到所在对象
      const object = evaluate(left.object, scope);
      // 获取对应的属性名称
      const property = left.computed
        ? evaluate(left.property, scope)
        : (left.property as ESTree.Identifier).name;

      // 生成变量对象
      variable = {
        get value() {
          return object[property];
        },
        set value(value: any) {
          object[property] = value;
        }
      };
    } else throw new TypeError(`Can not assign to type ${node.left.type}`);

    return {
      '=': (x: any) => (variable.value = x),
      '+=': (x: any) => (variable.value += x),
      '-=': (x: any) => (variable.value -= x),
      '*=': (x: any) => (variable.value *= x),
      '/=': (x: any) => (variable.value /= x),
      '%=': (x: any) => (variable.value %= x),
      '<<=': (x: any) => (variable.value <<= x),
      '>>=': (x: any) => (variable.value >>= x),
      '>>>=': (x: any) => (variable.value >>>= x),
      '**=': (x: any) => (variable.value **= x),
      '|=': (x: any) => (variable.value |= x),
      '^=': (x: any) => (variable.value ^= x),
      '&=': (x: any) => (variable.value &= x)
    }[node.operator](evaluate(node.right, scope));
  },

  /** 逻辑表达式 */
  LogicalExpression: (node: ESTree.LogicalExpression, scope: Scope) =>
    ({
      '||': () => evaluate(node.left, scope) || evaluate(node.right, scope),
      '&&': () => evaluate(node.left, scope) && evaluate(node.right, scope)
    }[node.operator]()),

  MemberExpression: (node: ESTree.MemberExpression, scope: Scope) => {
    const { object, property, computed } = node;

    if (computed) return evaluate(object, scope)[evaluate(property, scope)];

    return evaluate(object, scope)[(property as ESTree.Identifier).name];
  },

  /** 三元表达式 */
  ConditionalExpression: (node: ESTree.ConditionalExpression, scope: Scope) =>
    evaluate(node.test, scope)
      ? evaluate(node.consequent, scope)
      : evaluate(node.alternate, scope),

  /** call 表达式 */
  CallExpression: (node: ESTree.CallExpression, scope: Scope) => {
    const func = evaluate(node.callee, scope);
    const args = node.arguments.map(arg => evaluate(arg, scope));
    const thisVal = getThis(scope);

    if (node.callee.type === 'MemberExpression') {
      const object = evaluate(node.callee.object, scope);
      return func.apply(object, args);
    }

    return func.apply(thisVal?.value || null, args);
  },

  /** new 表达式 */
  NewExpression: (node: ESTree.NewExpression, scope: Scope) => {
    const func = evaluate(node.callee, scope);
    const args = node.arguments.map(arg => evaluate(arg, scope));

    // eslint-disable-next-line prefer-spread
    return new (func.bind.apply(func, [null].concat(args)))();
  },

  SequenceExpression: (node: ESTree.SequenceExpression, scope: Scope) => {
    let last;

    for (const expr of node.expressions) last = evaluate(expr, scope);

    return last;
  },

  TemplateLiteral: (node: ESTree.TemplateLiteral, _scope: Scope) => {
    throw new Error(`${node.type} 未实现`);
  },

  TaggedTemplateExpression: (
    node: ESTree.TaggedTemplateExpression,
    _scope: Scope
  ) => {
    throw new Error(`${node.type} 未实现`);
  },

  ClassExpression: (_node: ESTree.ClassExpression, _scope: Scope) => {
    // 小程序环境不支持
    throw new Error('class not supported in Wechat Miniprogram');
  },

  MetaProperty: (node: ESTree.MetaProperty, _scope: Scope) => {
    throw new Error(`${node.type} 未实现`);
  },

  AwaitExpression: (_node: ESTree.AwaitExpression, _scope: Scope) => {
    // 小程序环境不支持
    throw new Error('await not supported in Wechat Miniprogram');
  }
};

export default expressionHandler;
