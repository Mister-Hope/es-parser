import * as compiledParser from '../dist/parser';
import * as fs from 'fs';
import { describe, it } from 'mocha';
import { expect } from 'chai';
import parser from '../src';

describe('parser source code test', () => {
  // 解释器执行 hello world
  parser.run("console.log('hello world')");
});

describe('parser compiled code test', () => {
  // 自举解释器代码
  const parserCode = fs.readFileSync('./dist/parser.js', 'utf-8');
  const bootstrap = compiledParser.run(parserCode);

  // 自举的解释器实行 hello world
  bootstrap.run(`console.log('parser says hello world!')`);
});

describe('identifier test', () => {
  compiledParser.run(fs.readFileSync('./test/identifier.js', 'utf-8'), {
    describe,
    expect,
    it
  });
});

describe('declaration test', () => {
  compiledParser.run(fs.readFileSync('./test/declaration.js', 'utf-8'), {
    describe,
    expect,
    it
  });
});

describe('switch test', () => {
  compiledParser.run(fs.readFileSync('./test/switch.js', 'utf-8'), {
    expect,
    it
  });
});
