import * as fs from "fs";
import * as parser from "../dist/parser";
import { describe, it } from "mocha";
import { expect } from "chai";

parser.run(fs.readFileSync("./test/debug.js", "utf-8"), {
  describe,
  expect,
  it,
});
