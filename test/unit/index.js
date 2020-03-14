// @ts-nocheck
const { describe, it } = require('mocha');
const { expect } = require('chai');

describe('declaration test', () => {
  describe('var declaration', () => {
    it('variables can be declared by var', () => {
      let a;
      expect(a).to.be.equal(undefined);
    });

    it('uninited var variables can be assigned', () => {
      let a;
      a = 1;
      expect(a).to.be.equal(1);
    });

    it('variables can be declared and inited by var', () => {
      const b = 1;
      expect(b).to.be.equal(1);
    });

    it('var variables can be reassigned', () => {
      let b = 1;
      b = 2;
      expect(b).to.be.equal(2);
    });

    it('muti variables can be declaration in one var statement', () => {
      const a = 1;
      const b = 2;
      let c;
      let d;
      expect(a).to.be.equal(1);
      expect(b).to.be.equal(2);
      expect(c).to.be.equal(undefined);
      expect(d).to.be.equal(undefined);
    });
  });

  describe('let declaration', () => {
    it('variables can be declared by let', () => {
      let a;
      expect(a).to.be.equal(undefined);
    });

    it('uninited let variables can be assigned', () => {
      let a;
      a = 1;
      expect(a).to.be.equal(1);
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
        expect(err.message).to.be.equal('a is not defined');
      }
      expect(b).to.be.equal(2);
    });

    it('let variables can be reassigned', () => {
      let a = 1;
      a = 2;
      expect(a).to.be.equal(2);
    });

    it('muti variables can be declaration in one let statement', () => {
      const a = 1;
      const b = 2;
      let c;
      let d;
      expect(a).to.be.equal(1);
      expect(b).to.be.equal(2);
      expect(c).to.be.equal(undefined);
      expect(d).to.be.equal(undefined);
    });
  });

  describe('const declaration', () => {
    // WARNING: 这样写会直接导致 estree 解析失败，目前没有办法
    /*
     * try {
     *   const a;
     * } catch (err) {
     *   expect(err.message).to.be.equal(
     *     'SyntaxError: Missing initializer in const declaration a'
     *   );
     * }
     *
     * try {
     *   const a = 1,
     *     b;
     * } catch (err) {
     *   expect(err.message).to.be.equal('ReferenceError: b is not defined');
     * }
     */

    {
      const a = 1;
      it('const variable must be inited when declared', () => {
        expect(a).to.be.equal(1);
      });
    }

    it("const variables can't be reassigned", () => {
      try {
        const a = 1;
        a = 2;
      } catch (err) {
        expect(err.message).to.be.equal('Assignment to constant variable.');
      }
    });

    it("const variable in block scope can't be attached from outside", () => {
      const a = 2;
      expect(a).to.be.equal(2);
    });

    it('muti variables can be declaration in one const statement', () => {
      const b = 3;
      const c = 4;
      expect(b).to.be.equal(3);
      expect(c).to.be.equal(4);
    });
  });

  it("visiting undefined indetifier should throw error in 'use strict'", () => {
    try {
      console.log(a);
    } catch (err) {
      expect(err.message).to.be.equal('a is not defined');
    }
  });

  describe('function declaration', () => {
    /*
     * it('should move FunctionDeclaration to the top of the scope', () => {
     *   let counter = 0;
     *   hoisted(); // ReferenceError: hoisted is not defined
     *   function hoisted() {
     *     counter += 1;
     *   }
     *   expect(counter).to.be.equal(1);
     * });
     */
  });
});

describe('identifier test', () => {
  describe('Number Test', () => {
    it('int', () => {
      const a = 0;
      expect(a).to.be.equal(0);
    });

    it('decimal', () => {
      const b = 0.123;
      expect(b).to.be.equal(0.123);
    });

    it('science', () => {
      const c = 1.3e5;
      expect(c).to.be.equal(130000);
    });

    it('oct', () => {
      const d = 0b111110111;
      expect(d).to.be.equal(503);
    });

    it('hex', () => {
      const e = 0o767;
      expect(e).to.be.equal(503);
    });

    it('calculate', () => {
      const f = 1 + (4 * 3) / 2;
      const i = (1 + 2) * 3;
      let j = 1;
      j += 2;

      expect(f).to.be.equal(7);
      expect(i).to.be.equal(9);
      expect(j).to.be.equal(3);
    });

    it('transfrom', () => {
      const g = '1' * '2';
      expect(g).to.be.equal(2);
    });

    it('infinity', () => {
      const h = 1 / 0;
      expect(Number.isFinite(h)).to.be.equal(false);
    });

    it('NaN', () => {
      const k = '张' * 2;
      expect(Number.isNaN(k)).to.be.equal(true);
    });
  });

  describe('String test', () => {
    it('simple string', () => {
      const a = '1';
      expect(a).to.be.equal('1');
    });

    it('transferred string', () => {
      const b = '2\n34\\';
      expect(b).to.be.equal('2\n34\\');
      /*
       *   expect(b).to.be.equal(`2
       * 34\\`);
       */
    });

    it('template string', () => {
      /*
       *   const c = `${a}bc${1 + 2 + 3}`;
       *   const d = `中国
       * 加油`;
       * expect(c).to.be.equal('1bc6');
       * expect(d).to.be.equal('中国\n加油');
       */
    });
  });

  describe('Array test', () => {
    it('Array declare', () => {
      const a = ['a', 1, true];
      expect(a).to.be.deep.equal(['a', 1, true]);
      expect(a[0]).to.be.equal('a');
      expect(a[1]).to.be.equal(1);
      expect(a[2]).to.be.equal(true);
      expect(a[3]).to.be.equal(undefined);
      expect(a.length).to.be.equal(3);

      const b = new Array('a', 1, true);
      expect(b).to.be.deep.equal(['a', 1, true]);
      expect(b[0]).to.be.equal('a');
      expect(b[1]).to.be.equal(1);
      expect(b[2]).to.be.equal(true);
      expect(b[3]).to.be.equal(undefined);
      expect(b.length).to.be.equal(3);
    });
  });

  describe('Object test', () => {
    it('Object declare', () => {
      const a = { a: 1, b: 2 };
      expect(a).to.be.deep.equal({ a: 1, b: 2 });
      expect(a.a).to.be.equal(1);
      expect(a.c).to.be.equal(undefined);

      const b = new Object({ a: 1, b: 2 });
      expect(b).to.be.deep.equal({ a: 1, b: 2 });
      expect(b.a).to.be.equal(1);
      expect(b.c).to.be.equal(undefined);
    });

    describe('property', () => {
      const a = { a: 1, b: 2 };

      it('change', () => {
        a.a = 2;
        expect(a.a).to.be.equal(2);
      });

      it('add', () => {
        a.c = 3;
        expect(a.c).to.be.equal(3);
      });

      it('delete', () => {
        delete a.b;
        expect(a.b).to.be.equal(undefined);
        expect(Object.keys(a).indexOf('b')).to.be.equal(-1);
      });

      it('getter', () => {});
      it('setter', () => {});
    });

    describe('method', () => {
      it('method can be called', () => {
        const a = {
          message: 'Mr.Hope',
          output() {
            return this.message;
          },
          action() {
            return this.output();
          }
        };

        expect(a.output()).to.be.equal('Mr.Hope');
        expect(a.action()).to.be.equal('Mr.Hope');
      });

      it('function should resolve this', () => {
        const a = {
          message: 'Mr.Hope',
          output() {
            return this.message;
          }
        };

        expect(a.output()).to.be.equal('Mr.Hope');
      });

      it('arrow function shold hold this', () => {
        const a = {
          message: 'message in a',
          action() {
            const b = {
              message: 'message in b',
              say: () => this.message
            };
            const c = {
              message: 'message in b',
              say() {
                return this.message;
              }
            };
            expect(c.say()).to.be.equal('message in b');
          }
        };
      });
    });
  });

  describe('Boolean test', () => {
    it('transfrom', () => {
      expect(3 > 2).to.be.equal(true);
      expect(true).to.be.equal(!false);
      expect(!true).to.be.equal(false);
    });

    it('calculate', () => {
      expect(true && true).to.be.equal(true);
      expect(true && false).to.be.equal(false);
      expect(false && true).to.be.equal(false);
      expect(false && false).to.be.equal(false);
      expect(true || true).to.be.equal(true);
      expect(true || false).to.be.equal(true);
      expect(false || true).to.be.equal(true);
      expect(false || false).to.be.equal(false);
    });
  });

  it('undefined and null test', () => {
    expect(undefined).not.to.be.equal(null);
    expect(typeof undefined).to.be.equal('undefined');
    expect(typeof null).to.be.equal('object');
  });
});

describe('switch test', () => {
  // @ts-nocheck
  const testSwitch = function(value) {
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

  it('should handle default', () => {
    expect(testSwitch(-1)).to.be.equal(1);
  });

  it('should handle break', () => {
    expect(testSwitch(0)).to.be.equal(6);
    expect(testSwitch(1)).to.be.equal(5);
  });

  it('should handle fallthrough', () => {
    expect(testSwitch(3)).to.be.equal(2);
  });

  it('should fallthrough to default', () => {
    expect(testSwitch(5)).to.be.equal(2);
  });

  it('should handle return', () => {
    expect(testSwitch(2)).to.be.equal(4);
  });
});
