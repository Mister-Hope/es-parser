const acron = require("acorn");
const fs = require("fs");

const options = {
  ecmaVersion: 6,
  sourceType: "script",
  locations: true,
};

const codeString = fs.readFileSync("./test/code.js", "utf-8");
// @ts-ignore
const result = acron.parse(codeString, options);

console.log(result);

fs.writeFileSync("./test/estree.json", JSON.stringify(result));
