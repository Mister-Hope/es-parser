/* eslint-disable @typescript-eslint/no-unused-vars */
import * as ESTree from 'estree';
import { Scope } from './scope';

const moduleHandler = {
  MethodDefinition: (node: ESTree.MethodDefinition, _scope: Scope) => {
    throw new Error(`${node.type} 未实现`);
  },
  ImportDeclaration: (node: ESTree.ImportDeclaration, _scope: Scope) => {
    throw new Error(`${node.type} 未实现`);
  },
  ExportNamedDeclaration: (
    node: ESTree.ExportNamedDeclaration,
    _scope: Scope
  ) => {
    throw new Error(`${node.type} 未实现`);
  },
  ExportDefaultDeclaration: (
    node: ESTree.ExportDefaultDeclaration,
    _scope: Scope
  ) => {
    throw new Error(`${node.type} 未实现`);
  },
  ExportAllDeclaration: (node: ESTree.ExportAllDeclaration, _scope: Scope) => {
    throw new Error(`${node.type} 未实现`);
  },
  ImportSpecifier: (node: ESTree.ImportSpecifier, _scope: Scope) => {
    throw new Error(`${node.type} 未实现`);
  },
  ImportDefaultSpecifier: (
    node: ESTree.ImportDefaultSpecifier,
    _scope: Scope
  ) => {
    throw new Error(`${node.type} 未实现`);
  },
  ImportNamespaceSpecifier: (
    node: ESTree.ImportNamespaceSpecifier,
    _scope: Scope
  ) => {
    throw new Error(`${node.type} 未实现`);
  },
  ExportSpecifier: (node: ESTree.ExportSpecifier, _scope: Scope) => {
    throw new Error(`${node.type} 未实现`);
  }
};

export default moduleHandler;
