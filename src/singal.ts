/** Break 标志 */
export class Break {
  constructor(public label?: string) {}
}

/** Continue 标志 */
export class Continue {
  constructor(public label?: string) {}
}

/** Return 标志 */
export class Return {
  constructor(public result: any) {}
}

export const isBreak = <T>(value: T): boolean =>
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  value instanceof Break;

export const isContinue = <T>(value: T): boolean =>
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  value instanceof Continue;

export const isReturn = <T>(value: T): boolean =>
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  value instanceof Return;
