// @ts-nocheck
const { describe, it } = require('mocha');
const { expect } = require('chai');

describe('declaration test', () => {
  describe('var declaration', () => {
    var a;

    it('variables can be declared by var', () => {
      expect(a).to.be.equal(undefined);
    });

    it('uninited var variables can be assigned', () => {
      a = 1;
      expect(a).to.be.equal(1);
    });

    var b = 1;

    it('variables can be declared and inited by var', () => {
      expect(b).to.be.equal(1);
    });

    it('var variables can be reassigned', () => {
      b = 2;
      expect(b).to.be.equal(2);
    });

    it('muti variables can be declaration in one var statement', () => {
      var c = 1,
        d = 2;
      expect(c).to.be.equal(1);
      expect(d).to.be.equal(2);
    });
  });

  describe('let declaration', () => {
    {
      let a;
      it('variables can be declared by let', () => {
        expect(a).to.be.equal(undefined);
      });

      it('uninited let variables can be assigned', () => {
        a = 1;
        expect(a).to.be.equal(1);
      });
    }

    let a = 2;
    it("let variable in block scope can't be attached from outside", () => {
      expect(a).to.be.equal(2);
    });

    it('let variables can be reassigned', () => {
      a = 3;
      expect(a).to.be.equal(3);
    });

    it('muti variables can be declaration in one let statement', () => {
      let b = 3,
        c = 4,
        d;
      expect(b).to.be.equal(3);
      expect(c).to.be.equal(4);
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
      const b = 3,
        c = 4;
      expect(b).to.be.equal(3);
      expect(c).to.be.equal(4);
    });
  });

  it("visiting undefined indetifier should throw error in 'use strict'", () => {
    try {
      b = 1;
    } catch (err) {
      expect(err.message).to.be.equal('ReferenceError: b is not defined');
    }
  });
});

describe('identifier test', () => {
  it('Number test', () => {
    var a = 0.0;
    var b = 1 + 2 * 3;
    var c = '1' * '2';
    var d = 1 / 0;
    var e = (1 + 2) * 3;
    var f = 1;
    f += 2;
    var g = '张' * 2;

    expect(a).to.be.equal(0);
    expect(b).to.be.equal(7);
    expect(c).to.be.equal(2);
    expect(Number.isFinite(d)).to.be.equal(false);
    expect(e).to.be.equal(9);
    expect(f).to.be.equal(3);
    expect(Number.isNaN(g)).to.be.equal(true);
  });

  it('String test', () => {
    var a = '1';
    var b = '2\n34\\';
    //   var c = `${a}bc${1 + 2 + 3}`;
    //   var d = `中国
    // 加油`;
    expect(a).to.be.equal('1');
    expect(b).to.be.equal('2\n34\\');
    //   expect(b).to.be.equal(`2
    // 34\\`);
    // expect(c).to.be.equal('1bc6');
    // expect(d).to.be.equal('中国\n加油');
  });
});

describe('switch test', () => {
  // @ts-nocheck
  const testSwitch = function(value) {
    var temp = 0;
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
