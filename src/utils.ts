import * as ESTree from "estree";

/** 获得代码位置 */
export const getStack = (
  node: ESTree.Node,
  type: "start" | "end" = "start"
): string => {
  const loc = node.loc?.[type];

  return loc ? `\n    at ${loc.line}:${loc.column}` : "";
};

export const errorGenerator = (type: string): void => {
  throw new Error(`${type} not supported`);
};
