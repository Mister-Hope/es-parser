import * as compiledParser from "../dist/parser";
import * as fs from "fs";

// 解释器执行 hello world
compiledParser.run("console.log('hello world')");

// 自举解释器代码
const parserCode = fs.readFileSync("./dist/parser.js", "utf-8");
const bootstrap = compiledParser.run(parserCode);

// 自举的解释器实行 hello world
bootstrap.run(`console.log('parser says hello world!')`);
