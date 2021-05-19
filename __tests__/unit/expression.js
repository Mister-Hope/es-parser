// @ts-nocheck

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
