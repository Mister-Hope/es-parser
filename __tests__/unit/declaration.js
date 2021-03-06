// @ts-nocheck
describe("var declaration", () => {
  it("variables can be declared by var", () => {
    let a;
    expect(a).toEqual(undefined);
  });

  it("uninited var variables can be assigned", () => {
    let a;
    a = 1;
    expect(a).toEqual(1);
  });

  it("variables can be declared and inited by var", () => {
    const b = 1;
    expect(b).toEqual(1);
  });

  it("var variables can be reassigned", () => {
    let b = 1;
    b = 2;
    expect(b).toEqual(2);
  });

  it("muti variables can be declaration in one var statement", () => {
    const a = 1;
    const b = 2;
    let c;
    let d;
    expect(a).toEqual(1);
    expect(b).toEqual(2);
    expect(c).toEqual(undefined);
    expect(d).toEqual(undefined);
  });

  it("var variables is undefined before declaration", () => {
    expect(a).toEqual(undefined);
    var a;
  });
});

describe("let declaration", () => {
  it("variables can be declared by let", () => {
    let a;
    expect(a).toEqual(undefined);
  });

  it("uninited let variables can be assigned", () => {
    let a;
    a = 1;
    expect(a).toEqual(1);
  });

  it("let variable in block scope can't be attached from outside", () => {
    {
      const a = 1;
      const b = 1;
    }
    const b = 2;

    try {
      console.log(a);
    } catch (err) {
      expect(err.message).toEqual("a is not defined");
    }
    expect(b).toEqual(2);
  });

  it("let variables can be reassigned", () => {
    let a = 1;
    a = 2;
    expect(a).toEqual(2);
  });

  it("muti variables can be declaration in one let statement", () => {
    const a = 1;
    const b = 2;
    let c;
    let d;
    expect(a).toEqual(1);
    expect(b).toEqual(2);
    expect(c).toEqual(undefined);
    expect(d).toEqual(undefined);
  });
});

describe("const declaration", () => {
  // WARNING: 这样写会直接导致 estree 解析失败，目前没有办法
  /*
   * try {
   *   const a;
   * } catch (err) {
   *   expect(err.message).toEqual(
   *     'SyntaxError: Missing initializer in const declaration a'
   *   );
   * }
   *
   * try {
   *   const a = 1,
   *     b;
   * } catch (err) {
   *   expect(err.message).toEqual('ReferenceError: b is not defined');
   * }
   */

  {
    const a = 1;
    it("const variable must be inited when declared", () => {
      expect(a).toEqual(1);
    });
  }

  it("const variables can't be reassigned", () => {
    try {
      const a = 1;
      a = 2;
    } catch (err) {
      expect(err.message).toEqual("Assignment to constant variable.");
    }
  });

  it("const variable in block scope can't be attached from outside", () => {
    const a = 2;
    expect(a).toEqual(2);
  });

  it("muti variables can be declaration in one const statement", () => {
    const b = 3;
    const c = 4;
    expect(b).toEqual(3);
    expect(c).toEqual(4);
  });
});

it("visiting undefined indetifier should throw error in 'use strict'", () => {
  try {
    console.log(a);
  } catch (err) {
    expect(err.message).toEqual("a is not defined");
  }
});

describe("function declaration", () => {
  it("type of function should be function", () => {
    function a() {}
    expect(typeof a).toEqual("function");
  });

  it("should move FunctionDeclaration to the top of the scope", () => {
    let counter = 0;
    hoisted(); // ReferenceError: hoisted is not defined
    function hoisted() {
      counter += 1;
    }
    expect(counter).toEqual(1);
  });

  it("function can have property", () => {
    function a() {
      return 0;
    }
    expect(typeof a).toEqual("function");
    expect(a()).toEqual(0);
    expect(a.a).toEqual(undefined);
  });

  it("function can add property", () => {
    a.a = 1;
    function a() {
      return 0;
    }
    expect(typeof a).toEqual("function");
    expect(a()).toEqual(0);
    expect(a.a).toEqual(1);
  });

  it("function can change property", () => {
    a.a = 1;
    function a() {
      return 0;
    }
    expect(typeof a).toEqual("function");
    expect(a()).toEqual(0);
    expect(a.a).toEqual(1);
    a.a = 2;
    expect(typeof a).toEqual("function");
    expect(a()).toEqual(0);
    expect(a.a).toEqual(2);
  });

  it("function can delete property", () => {
    a.a = 1;
    function a() {
      return 0;
    }
    expect(typeof a).toEqual("function");
    expect(a()).toEqual(0);
    expect(a.a).toEqual(1);
    delete a.a;
    expect(typeof a).toEqual("function");
    expect(a()).toEqual(0);
    expect(a.a).toEqual(undefined);
  });
});
