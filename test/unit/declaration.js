// @ts-nocheck
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

  it('var variables is undefined before declaration', () => {
    expect(a).to.be.equal(undefined);
    var a;
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
  it('should move FunctionDeclaration to the top of the scope', () => {
    let counter = 0;
    hoisted(); // ReferenceError: hoisted is not defined
    function hoisted() {
      counter += 1;
    }
    expect(counter).to.be.equal(1);
  });
});
