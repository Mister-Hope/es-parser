/* eslint-disable max-classes-per-file */
/** 作用域类型 */
export type ScopeType = 'function' | 'loop' | 'switch' | 'block';

/** 声明类型 */
export type DeclarationType = 'const' | 'let' | 'var';

export interface Variable {
  // 变量的值
  value: any;
}

/** 作用域变量 */
class ScopeVariable implements Variable {
  /** 变量声明类型 */
  private declarationType: DeclarationType;

  /** 变量值 */
  private _value: any;

  constructor(declarationType: DeclarationType, value: any) {
    this.declarationType = declarationType;
    this._value = value;
  }

  /** 获取作用域变量值 */
  public get value() {
    return this._value;
  }

  /**
   * 设置作用域变量值
   *
   * @param value
   * @returns 是否设置成功
   */
  public set value(value: any) {
    // const 不能二次赋值
    if (this.declarationType === 'const')
      throw new TypeError('Assignment to constant variable.');

    this._value = value;
  }
}

/** 作用域 */
export class Scope {
  /** 声明的变量 */
  private variables: Record<string, Variable>;

  /** this 指针 */
  public this: any;

  /** 父作用域 */
  public parent: Scope | null;

  /** 作用域类型 */
  public readonly type: ScopeType;

  constructor(type: ScopeType, parent?: Scope, ctx?: any) {
    this.type = type;
    this.this = ctx || undefined;
    this.parent = parent || null;
    this.variables = {};
  }

  /** 尝试获取变量值 */
  public find(varName: string): Variable | undefined {
    const name = `@${varName}`;
    // eslint-disable-next-line no-prototype-builtins
    if (this.variables.hasOwnProperty(name)) return this.variables[name];
    else if (this.parent) return this.parent.find(varName);

    return undefined;
  }

  /** 得到变量值 */
  public get(varName: string): Variable {
    const name = `@${varName}`;
    // eslint-disable-next-line no-prototype-builtins
    if (this.variables.hasOwnProperty(name)) return this.variables[name];
    else if (this.parent) return this.parent.get(varName);

    throw new ReferenceError(`${varName} is not defined`);
  }

  /**
   * let 声明变量
   *
   * @param varName 变量名
   * @param value 变量值
   * @returns 声明是否成功
   */
  public let(varName: string, value: any) {
    const name = `@${varName}`;
    if (this.variables[name])
      throw new SyntaxError(
        `SyntaxError: Identifier '${varName}' has already been declared`
      );

    this.variables[name] = new ScopeVariable('let', value);
  }

  /**
   * const 声明变量
   *
   * @param varName 变量名
   * @param value 变量值
   * @returns 声明是否成功
   */
  public const(varName: string, value: any) {
    // `const a;` 这种写法会直接导致 acorn 解析失败
    /*
     * if (arguments.length === 1)
     *   throw new Error(
     *     `SyntaxError: Missing initializer in const declaration ${varName}`
     *   );
     */

    const name = `@${varName}`;
    if (this.variables[name])
      throw new SyntaxError(
        `SyntaxError: Identifier '${varName}' has already been declared`
      );

    this.variables[name] = new ScopeVariable('const', value);
  }

  /**
   * var 声明变量
   *
   * @param varName 变量名
   * @param value 变量值
   * @returns 声明是否成功
   */
  public var(varName: string, value: any) {
    const name = `@${varName}`;

    // eslint-disable-next-line
    let scope: Scope = this;

    while (scope.parent !== null && scope.type !== 'function')
      scope = scope.parent;

    if (scope.variables[name])
      console.warn(
        `SyntaxWarning: Identifier '${varName}' has already been declared`
      );

    this.variables[name] = new ScopeVariable('var', value);
  }

  /**
   * 声明变量
   *
   * @param declarationType 声明方式
   * @param varName 变量名
   * @param value 变量值
   * @returns 声明是否成功
   */
  public declare(
    declarationType: DeclarationType,
    varName: string,
    value: any
  ) {
    this[declarationType](varName, value);
  }
}
