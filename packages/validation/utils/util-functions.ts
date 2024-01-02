export function isString(value: any): value is string {
  return typeof value === "string";
}

export function isNumber(value: any): value is number {
  return typeof value === "number";
}

export const isValidRegex = (value: string, regex: RegExp) => {
  return regex.test(value);
};
