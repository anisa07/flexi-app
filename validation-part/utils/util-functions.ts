export function isString(value: string | number): value is string {
  return typeof value === "string";
}

export function isNumber(value: string | number): value is number {
  return typeof value === "number";
}

export const isValidRegex = (value: string, regex: RegExp) => {
  return regex.test(value);
};
