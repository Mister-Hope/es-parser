import * as acorn from "acorn";

const options: acorn.Options = {
  ecmaVersion: 6,
  sourceType: "script",
  locations: true,
};

/** 解析代码 */
export const parse = (code: string): acorn.Node => acorn.parse(code, options);
