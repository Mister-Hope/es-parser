// @ts-nocheck

describe("UnaryExpression", () => {
  describe("typeof", () => {
    it("typeof null is object", () => {
      expect(typeof null).to.be.equal("object");
    });

    it("undeclared variable is undefined", () => {
      expect(typeof a).to.be.equal("undefined");
    });

    it("undefined is undefined", () => {
      expect(typeof undefined).to.be.equal("undefined");
    });

    it("number", () => {
      expect(typeof 1).to.be.equal("number");
      expect(typeof 5e12).to.be.equal("number");
      expect(typeof 0b0110).to.be.equal("number");
      expect(typeof 0o122).to.be.equal("number");
      expect(typeof Number.NaN).to.be.equal("number");
      expect(typeof Infinity).to.be.equal("number");
      expect(typeof 1.123).to.be.equal("number");
      expect(typeof Number("1e asd")).to.be.equal("number");
    });

    it("boolean", () => {
      expect(typeof true).to.be.equal("boolean");
      expect(typeof false).to.be.equal("boolean");
      expect(typeof Boolean("1e asd")).to.be.equal("boolean");
    });

    it("function", () => {
      function a() {}
      const b = () => "";
      expect(typeof a).to.be.equal("function");
      expect(typeof b).to.be.equal("function");
    });
  });
});
