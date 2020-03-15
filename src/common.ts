import * as ESTree from 'estree';
import { Scope } from './scope';
import evaluate from './eval';

/** Break 标志 */
export const BREAK = Symbol('BREAK');
/** Continue 标志 */
export const CONTINUE = Symbol('CONTINUE');
/** Return 标志 */
export const RETURN_SINGAL: { result: any } = { result: undefined };

/** 获得代码位置 */
export const getLocation = (node: ESTree.Node, type: 'start' | 'end') => {
  const loc = node.loc?.[type];

  return loc ? `${loc.line}:${loc.column}` : '';
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
  function Function(...args: any[]) {
    /** 函数作用域 */
    const functionScope = new Scope(
      'function',
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
    functionScope.const('arguments', args);

    // 解析函数体
    const result = evaluate(node.body, functionScope);

    // 如果函数体存在返回值，则返回
    if (result === RETURN_SINGAL) return result.result;
  };
