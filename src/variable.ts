/* eslint-disable max-classes-per-file */
/** 声明类型 */
export type DeclarationType = "const" | "let" | "var" | "function";

/** 变量 */
export interface Variable<T = any> {
  // 变量的值
  value: T;
}

/** 作用域变量 */
export class ScopeVariable<T = any> implements Variable<T> {
  constructor(
    /** 变量声明类型 */
    private declarationType: DeclarationType,
    /** 变量值 */
    private _value: T
  ) {}

  public get value(): T {
    return this._value;
  }

  public set value(value: T) {
    // const 不能二次赋值
    if (this.declarationType === "const")
      throw new TypeError("Assignment to constant variable.");

    this._value = value;
  }
}

export class FunctionVariable<T = any> implements Variable<T> {
  /** 函数属性 */
  public _properties: Record<any, any> = {};

  constructor(
    /** 函数体 */
    private _value: T
  ) {}

  public get value(): T {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return Object.assign(this._value(), {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      __props__: this._properties,
    });
  }

  public set value(value: T) {
    this._value = value;
  }
}
