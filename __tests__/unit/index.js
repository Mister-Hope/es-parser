// @ts-nocheck
const { describe, it } = require("mocha");
const { expect } = require("chai");

describe("declaration test", () => {
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
      hoisted();
      function hoisted() {
        counter += 1;
      }

      expect(counter).toEqual(1);
    });

    it("function can refer undeclared variable", () => {
      function hoisted() {
        counter += 1;
      }
      let counter = 0;
      hoisted();

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
});

describe("identifier test", () => {
  describe("Number Test", () => {
    it("int", () => {
      const a = 0;
      expect(a).toEqual(0);
    });

    it("decimal", () => {
      const b = 0.123;
      expect(b).toEqual(0.123);
    });

    it("science", () => {
      const c = 1.3e5;
      expect(c).toEqual(130000);
    });

    it("oct", () => {
      const d = 0b111110111;
      expect(d).toEqual(503);
    });

    it("hex", () => {
      const e = 0o767;
      expect(e).toEqual(503);
    });

    it("calculate", () => {
      const f = 1 + (4 * 3) / 2;
      const i = (1 + 2) * 3;
      let j = 1;
      j += 2;

      expect(f).toEqual(7);
      expect(i).toEqual(9);
      expect(j).toEqual(3);
    });

    it("transfrom", () => {
      const g = "1" * "2";
      expect(g).toEqual(2);
    });

    it("infinity", () => {
      const h = 1 / 0;
      expect(Number.isFinite(h)).toEqual(false);
    });

    it("NaN", () => {
      const k = "张" * 2;
      expect(Number.isNaN(k)).toEqual(true);
    });
  });

  describe("String test", () => {
    it("simple string", () => {
      const a = "1";
      expect(a).toEqual("1");
    });

    it("transferred string", () => {
      const b = "2\n34\\";
      expect(b).toEqual("2\n34\\");
      /*
       *   expect(b).toEqual(`2
       * 34\\`);
       */
    });

    it("template string", () => {
      /*
       *   const c = `${a}bc${1 + 2 + 3}`;
       *   const d = `中国
       * 加油`;
       * expect(c).toEqual('1bc6');
       * expect(d).toEqual('中国\n加油');
       */
    });
  });

  describe("Array test", () => {
    it("Array declare", () => {
      const a = ["a", 1, true];
      expect(a).to.be.deep.equal(["a", 1, true]);
      expect(a[0]).toEqual("a");
      expect(a[1]).toEqual(1);
      expect(a[2]).toEqual(true);
      expect(a[3]).toEqual(undefined);
      expect(a.length).toEqual(3);

      const b = new Array("a", 1, true);
      expect(b).to.be.deep.equal(["a", 1, true]);
      expect(b[0]).toEqual("a");
      expect(b[1]).toEqual(1);
      expect(b[2]).toEqual(true);
      expect(b[3]).toEqual(undefined);
      expect(b.length).toEqual(3);
    });
  });

  describe("Object test", () => {
    it("Object declare", () => {
      const a = { a: 1, b: 2 };
      expect(a).to.be.deep.equal({ a: 1, b: 2 });
      expect(a.a).toEqual(1);
      expect(a.c).toEqual(undefined);

      const b = new Object({ a: 1, b: 2 });
      expect(b).to.be.deep.equal({ a: 1, b: 2 });
      expect(b.a).toEqual(1);
      expect(b.c).toEqual(undefined);
    });

    describe("property", () => {
      const a = { a: 1, b: 2 };

      it("change", () => {
        a.a = 2;
        expect(a.a).toEqual(2);
      });

      it("add", () => {
        a.c = 3;
        expect(a.c).toEqual(3);
      });

      it("delete", () => {
        delete a.b;
        expect(a.b).toEqual(undefined);
        expect(Object.keys(a).indexOf("b")).toEqual(-1);
      });

      it("getter", () => {});
      it("setter", () => {});
    });

    describe("method", () => {
      it("method can be called", () => {
        const a = {
          message: "Mr.Hope",
          output() {
            return this.message;
          },
          action() {
            return this.output();
          },
        };

        expect(a.output()).toEqual("Mr.Hope");
        expect(a.action()).toEqual("Mr.Hope");
      });

      it("function should resolve this", () => {
        const a = {
          message: "Mr.Hope",
          output() {
            return this.message;
          },
        };

        expect(a.output()).toEqual("Mr.Hope");
      });

      it("arrow function shold hold this", () => {
        const a = {
          message: "message in a",
          action() {
            const b = {
              message: "message in b",
              say: () => this.message,
            };
            const c = {
              message: "message in b",
              say() {
                return this.message;
              },
            };
            expect(c.say()).toEqual("message in b");
          },
        };
      });
    });
  });

  describe("Boolean test", () => {
    it("transfrom", () => {
      expect(3 > 2).toEqual(true);
      expect(true).toEqual(!false);
      expect(!true).toEqual(false);
    });

    it("calculate", () => {
      expect(true && true).toEqual(true);
      expect(true && false).toEqual(false);
      expect(false && true).toEqual(false);
      expect(false && false).toEqual(false);
      expect(true || true).toEqual(true);
      expect(true || false).toEqual(true);
      expect(false || true).toEqual(true);
      expect(false || false).toEqual(false);
    });
  });

  it("undefined and null test", () => {
    expect(undefined).not.toEqual(null);
    expect(typeof undefined).toEqual("undefined");
    expect(typeof null).toEqual("object");
  });
});

describe("switch test", () => {
  const testSwitch = function (value) {
    let temp = 0;
    switch (value) {
      case 0:
        temp = 6;
        break;
      case 1:
        temp = 5;
        break;
        temp = 2;
      case 2:
        temp = 3;
        return 4;
      case 3:
        temp += 1;
      case 4:
        temp += 1;
        break;
      case 5:
        temp += 1;
      default:
        temp += 1;
    }

    return temp;
  };

  it("should handle default", () => {
    expect(testSwitch(-1)).toEqual(1);
  });

  it("should handle break", () => {
    expect(testSwitch(0)).toEqual(6);
    expect(testSwitch(1)).toEqual(5);
  });

  it("should handle fallthrough", () => {
    expect(testSwitch(3)).toEqual(2);
  });

  it("should fallthrough to default", () => {
    expect(testSwitch(5)).toEqual(2);
  });

  it("should handle return", () => {
    expect(testSwitch(2)).toEqual(4);
  });
});

describe("UnaryExpression", () => {
  describe("typeof", () => {
    it("typeof null is object", () => {
      expect(typeof null).toEqual("object");
    });

    it("undeclared variable is undefined", () => {
      expect(typeof a).toEqual("undefined");
    });

    it("undefined is undefined", () => {
      expect(typeof undefined).toEqual("undefined");
    });

    it("number", () => {
      expect(typeof 1).toEqual("number");
      expect(typeof 5e12).toEqual("number");
      expect(typeof 0b0110).toEqual("number");
      expect(typeof 0o122).toEqual("number");
      expect(typeof Number.NaN).toEqual("number");
      expect(typeof Infinity).toEqual("number");
      expect(typeof 1.123).toEqual("number");
      expect(typeof Number("1e asd")).toEqual("number");
    });

    it("boolean", () => {
      expect(typeof true).toEqual("boolean");
      expect(typeof false).toEqual("boolean");
      expect(typeof Boolean("1e asd")).toEqual("boolean");
    });

    it("function", () => {
      function a() {}
      const b = () => "";
      expect(typeof a).toEqual("function");
      expect(typeof b).toEqual("function");
    });
  });
});
