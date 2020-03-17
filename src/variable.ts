/* eslint-disable max-classes-per-file */
/** 声明类型 */
export type DeclarationType = 'const' | 'let' | 'var' | 'function';

/** 变量 */
export interface Variable {
  // 变量的值
  value: any;
}

/** 作用域变量 */
export class ScopeVariable implements Variable {
  constructor(
    /** 变量声明类型 */
    private declarationType: DeclarationType,
    /** 变量值 */
    private _value: any
  ) {}

  public get value() {
    return this._value;
  }

  public set value(value: any) {
    // const 不能二次赋值
    if (this.declarationType === 'const')
      throw new TypeError('Assignment to constant variable.');

    this._value = value;
  }
}

export class FunctionVariable implements Variable {
  /** 函数属性 */
  public _properties: Record<any, any> = {};

  constructor(
    /** 函数体 */
    private _value: any
  ) {}

  public get value() {
    return Object.assign(this._value(), { __props__: this._properties });
  }

  public set value(value: any) {
    this._value = value;
  }
}
