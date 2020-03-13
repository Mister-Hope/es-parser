// @ts-nocheck
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
