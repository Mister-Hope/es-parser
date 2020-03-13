export function run(parseString: string, globalVar?: Record<string, any>): any;

type parser = {
  run: (parseString: string, globalVar?: Record<string, any>) => any;
};
export default parser;
