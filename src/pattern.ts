/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-unused-vars */

import * as ESTree from "estree";
import { Scope } from "./scope";

const patternHandler = {
  ObjectPattern: (node: ESTree.ObjectPattern, _scope: Scope): void => {
    throw new Error(`${node.type} 未实现`);
  },

  ArrayPattern: (node: ESTree.ArrayPattern, _scope: Scope): void => {
    throw new Error(`${node.type} 未实现`);
  },

  RestElement: (node: ESTree.RestElement, _scope: Scope): void => {
    throw new Error(`${node.type} 未实现`);
  },

  AssignmentPattern: (node: ESTree.AssignmentPattern, _scope: Scope): void => {
    throw new Error(`${node.type} 未实现`);
  },
};

export default patternHandler;
