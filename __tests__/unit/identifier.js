// @ts-nocheck
describe("Number", () => {
  it("int", () => {
    const a = 0;
    expect(a).toEqual(Number(""));
  });

  it("decimal", () => {
    const b = 0.123;
    expect(b).toEqual(123 / 1000);
  });

  it("science", () => {
    const c = 1.3e5;
    expect(c).toEqual(130000);
  });

  it("bin", () => {
    const d = 0b111110111;
    expect(d).toEqual(503);
  });

  it("infinity", () => {
    const h = 1 / 0;
    expect(Number.isFinite(h)).toEqual(false);
    expect(h).toEqual(Infinity);
  });

  it("NaN", () => {
    const k = "张" * 2;
    expect(Number.isNaN(k)).toEqual(true);
    expect(Number.NaN === k).toEqual(false);
  });

  it("oct", () => {
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
    expect(a).toEqual(["a", 1, true]);
    expect(a[0]).toEqual("a");
    expect(a[1]).toEqual(1);
    expect(a[2]).toEqual(true);
    expect(a[3]).toEqual(undefined);
    expect(a.length).toEqual(3);

    const b = new Array("a", 1, true);
    expect(b).toEqual(["a", 1, true]);
    expect(b[0]).toEqual("a");
    expect(b[1]).toEqual(1);
    expect(b[2]).toEqual(true);
    expect(b[3]).toEqual(undefined);
    expect(b.length).toEqual(3);
  });
});

describe("Object", () => {
  it("can be declared", () => {
    const a = { a: 1, b: 2 };
    expect(a).toEqual({ a: 1, b: 2 });
    expect(a.a).toEqual(1);
    expect(a.c).toEqual(undefined);

    const b = new Object({ a: 1, b: 2 });
    expect(b).toEqual({ a: 1, b: 2 });
    expect(b.a).toEqual(1);
    expect(b.c).toEqual(undefined);
  });

  it("should allow duplicate object key", () => {
    const obj = {
      a: 1,
      a: 2,
    };
    expect(obj).toEqual({ a: 2 });
    expect(Object.keys(obj).length).toEqual(1);
  });

  describe("'s property", () => {
    const a = { a: 1, b: 2 };

    it("can be changed", () => {
      a.a = 2;
      expect(a.a).toEqual(2);
    });

    it("can be added", () => {
      a.c = 3;
      expect(a.c).toEqual(3);
    });

    it("can be deleted", () => {
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
});

describe("function", () => {
  describe("'s prototype", () => {
    // it('can be set', () => {
    //   function a() {}

    //   a.prototype = {
    //     say: function() {}
    //   };

    //   const b = new a();

    //   expect(typeof a).toEqual('function');
    //   expect(typeof b.say).toEqual('function');
    //   expect(b.__proto__).toEqual(a.prototype);
    //   expect(b.__proto__.say).toEqual(b.say);
    // });

    it("can be override", () => {
      const a = function (text) {};

      a.prototype = {
        toString() {
          return JSON.stringify(this);
        },
        valueOf() {
          return 1;
        },
      };

      const b = new a();

      expect(typeof a).toEqual("function");
      expect(b.__proto__).toEqual(a.prototype);
      expect(typeof b.toString).toEqual("function");
      expect(typeof b.valueOf).toEqual("function");
      expect(b.toString).toEqual(a.prototype.toString);
      expect(b.valueOf).toEqual(a.prototype.valueOf);
      expect(b + 1).toEqual(2);
    });
  });
});
