import * as ESTree from "estree";
import { Scope } from "./scope";

// TODO: build it
export const MethodDefinition = (
  node: ESTree.MethodDefinition,
  _scope: Scope
): void => {
  throw new Error(`${node.type} 未实现`);
};

export const ImportDeclaration = (
  node: ESTree.ImportDeclaration,
  _scope: Scope
): void => {
  throw new Error(`${node.type} 未实现`);
};

export const ImportSpecifier = (
  node: ESTree.ImportSpecifier,
  _scope: Scope
): void => {
  throw new Error(`${node.type} 未实现`);
};

export const ImportDefaultSpecifier = (
  node: ESTree.ImportDefaultSpecifier,
  _scope: Scope
): void => {
  throw new Error(`${node.type} 未实现`);
};

export const ImportNamespaceSpecifier = (
  node: ESTree.ImportNamespaceSpecifier,
  _scope: Scope
): void => {
  throw new Error(`${node.type} 未实现`);
};

export const ExportNamedDeclaration = (
  node: ESTree.ExportNamedDeclaration,
  _scope: Scope
): void => {
  throw new Error(`${node.type} 未实现`);
};

export const ExportDefaultDeclaration = (
  node: ESTree.ExportDefaultDeclaration,
  _scope: Scope
): void => {
  throw new Error(`${node.type} 未实现`);
};

export const ExportAllDeclaration = (
  node: ESTree.ExportAllDeclaration,
  _scope: Scope
): void => {
  throw new Error(`${node.type} 未实现`);
};

export const ExportSpecifier = (
  node: ESTree.ExportSpecifier,
  _scope: Scope
): void => {
  throw new Error(`${node.type} 未实现`);
};
