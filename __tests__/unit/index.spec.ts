import * as compiledParser from "../../dist/parser";
import * as fs from "fs";
import parser from "../../src";

const base = "./__tests__/unit";

describe("parser source code test", () => {
  // 解释器执行 hello world
  parser.run("console.log('hello world')");
});

describe("identifier test", () => {
  compiledParser.run(fs.readFileSync(`${base}/identifier.js`, "utf-8"), {
    describe,
    expect,
    it,
  });
});

describe("declaration test", () => {
  compiledParser.run(fs.readFileSync(`${base}/declaration.js`, "utf-8"), {
    describe,
    expect,
    it,
  });
});

describe("expression test", () => {
  compiledParser.run(fs.readFileSync(`${base}/expression.js`, "utf-8"), {
    describe,
    expect,
    it,
  });
});

describe("switch test", () => {
  compiledParser.run(fs.readFileSync(`${base}/switch.js`, "utf-8"), {
    expect,
    it,
  });
});
