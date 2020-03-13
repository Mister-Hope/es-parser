// @ts-nocheck
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

it('String test', () => {
  const a = '1';
  const b = '2\n34\\';
  //   const c = `${a}bc${1 + 2 + 3}`;
  //   const d = `中国
  // 加油`;
  expect(a).to.be.equal('1');
  expect(b).to.be.equal('2\n34\\');
  //   expect(b).to.be.equal(`2
  // 34\\`);
  // expect(c).to.be.equal('1bc6');
  // expect(d).to.be.equal('中国\n加油');
});
