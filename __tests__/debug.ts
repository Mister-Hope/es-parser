import * as fs from "fs";
import * as parser from "../dist/parser";

parser.run(fs.readFileSync("./test/debug.js", "utf-8"), {
  describe,
  expect,
  it,
});
