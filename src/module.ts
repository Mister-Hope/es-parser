import * as ESTree from "estree";
import { Scope } from "./scope";
import { errorGenerator } from "./utils";

// TODO: build it

export const moduleHandler = {
  MethodDefinition: (node: ESTree.MethodDefinition, _scope: Scope): void => {
    errorGenerator(node.type);
  },

  ImportDeclaration: (node: ESTree.ImportDeclaration, _scope: Scope): void => {
    errorGenerator(node.type);
  },

  ImportExpression: (node: ESTree.ImportExpression, _scope: Scope): void => {
    errorGenerator(node.type);
  },

  ImportSpecifier: (node: ESTree.ImportSpecifier, _scope: Scope): void => {
    errorGenerator(node.type);
  },

  ImportDefaultSpecifier: (
    node: ESTree.ImportDefaultSpecifier,
    _scope: Scope
  ): void => {
    errorGenerator(node.type);
  },

  ImportNamespaceSpecifier: (
    node: ESTree.ImportNamespaceSpecifier,
    _scope: Scope
  ): void => {
    errorGenerator(node.type);
  },

  ExportNamedDeclaration: (
    node: ESTree.ExportNamedDeclaration,
    _scope: Scope
  ): void => {
    errorGenerator(node.type);
  },

  ExportDefaultDeclaration: (
    node: ESTree.ExportDefaultDeclaration,
    _scope: Scope
  ): void => {
    errorGenerator(node.type);
  },

  ExportAllDeclaration: (
    node: ESTree.ExportAllDeclaration,
    _scope: Scope
  ): void => {
    errorGenerator(node.type);
  },

  ExportSpecifier: (node: ESTree.ExportSpecifier, _scope: Scope): void => {
    errorGenerator(node.type);
  },
};
