import * as acorn from "acorn";

export function parse(codeString: string): acorn.Node;
export function run(codeString: string, globalVar?: Record<string, any>): any;

type parser = {
  run(codeString: string, globalVar?: Record<string, any>): any;
  parse(codeString: string): acorn.Node;
};

export default parser;
