import { run } from "../../dist/parser";
import * as fs from "fs";
import { run as sourceRun } from "../../src";

const base = "./__tests__/unit";

describe("parser source code test", () => {
  // 解释器执行 hello world
  sourceRun("console.log('hello world')");
});

describe("identifier test", () => {
  run(fs.readFileSync(`${base}/identifier.js`, "utf-8"), {
    describe,
    expect,
    it,
  });
});

describe("declaration test", () => {
  run(fs.readFileSync(`${base}/declaration.js`, "utf-8"), {
    describe,
    expect,
    it,
  });
});

describe("expression test", () => {
  run(fs.readFileSync(`${base}/expression.js`, "utf-8"), {
    describe,
    expect,
    it,
  });
});

describe("switch test", () => {
  run(fs.readFileSync(`${base}/switch.js`, "utf-8"), {
    expect,
    it,
  });
});
