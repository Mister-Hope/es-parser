/* eslint-disable max-classes-per-file */
/** 作用域类型 */
export type ScopeType = 'function' | 'loop' | 'switch' | 'block';

/** 声明类型 */
export type DeclarationType = 'const' | 'let' | 'var';

/** 变量 */
export interface Variable {
  /** 获取变量值 */
  get(): any;
  /** 设置变量值 */
  set(value: any): void;
}

/** 作用域变量 */
export class ScopeVar implements Variable {
  /** 变量声明类型 */
  private declarationType: DeclarationType;

  /** 变量值 */
  private value: any;

  constructor(declarationType: DeclarationType, value: any) {
    this.declarationType = declarationType;
    this.value = value;
  }

  /** 获取作用域变量值 */
  get() {
    return this.value;
  }

  /**
   * 设置作用域变量值
   *
   * @param value
   * @returns 是否设置成功
   */
  set(value: any) {
    // const 不能二次赋值
    if (this.declarationType === 'const')
      throw new TypeError('Assignment to constant variable.');

    this.value = value;
  }
}

/** 属性变量 */
export class PropVariable implements Variable {
  /** 对象 */
  object: any;

  /** 属性 */
  property: string;

  constructor(object: any, property: string) {
    this.object = object;
    this.property = property;
  }

  /** 获得对象属性值 */
  get() {
    return this.object[this.property];
  }

  /** 设置对象属性值 */
  set(value: any) {
    this.object[this.property] = value;
  }

  /** 删除对象属性值 */
  delete() {
    delete this.object[this.property];
  }
}

/** 作用域 */
export class Scope {
  /** 声明的变量 */
  private variables: Record<string, Variable>;

  /** 父作用域 */
  private parent: Scope | null;

  /** 作用域类型 */
  readonly type: ScopeType;

  invasived: boolean;

  constructor(type: ScopeType, parent?: Scope) {
    this.type = type;
    this.parent = parent || null;
    this.variables = {};
    this.invasived = false;
  }

  /** 尝试获取变量值 */
  find(varName: string): Variable | undefined {
    const name = `@${varName}`;
    // eslint-disable-next-line no-prototype-builtins
    if (this.variables.hasOwnProperty(name)) return this.variables[name];
    else if (this.parent) return this.parent.find(varName);

    return undefined;
  }

  /** 得到变量值 */
  get(varName: string): Variable {
    const name = `@${varName}`;
    // eslint-disable-next-line no-prototype-builtins
    if (this.variables.hasOwnProperty(name)) return this.variables[name];
    else if (this.parent) return this.parent.get(varName);

    throw new ReferenceError(`ReferenceError: ${varName} is not defined`);
  }

  /**
   * let 声明变量
   *
   * @param varName 变量名
   * @param value 变量值
   * @returns 声明是否成功
   */
  let(varName: string, value: any) {
    const name = `@${varName}`;
    if (this.variables[name])
      throw new SyntaxError(
        `SyntaxError: Identifier '${varName}' has already been declared`
      );

    this.variables[name] = new ScopeVar('let', value);
  }

  /**
   * const 声明变量
   *
   * @param varName 变量名
   * @param value 变量值
   * @returns 声明是否成功
   */
  const(varName: string, value: any) {
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

    this.variables[name] = new ScopeVar('const', value);
  }

  /**
   * var 声明变量
   *
   * @param varName 变量名
   * @param value 变量值
   * @returns 声明是否成功
   */
  var(varName: string, value: any) {
    const name = `@${varName}`;

    // eslint-disable-next-line
    let scope: Scope = this;

    while (scope.parent !== null && scope.type !== 'function')
      scope = scope.parent;

    if (scope.variables[name])
      console.warn(
        `SyntaxWarning: Identifier '${varName}' has already been declared`
      );

    this.variables[name] = new ScopeVar('var', value);
  }

  /**
   * 声明变量
   *
   * @param declarationType 声明方式
   * @param varName 变量名
   * @param value 变量值
   * @returns 声明是否成功
   */
  declare(declarationType: DeclarationType, varName: string, value: any) {
    this[declarationType](varName, value);
  }
}
