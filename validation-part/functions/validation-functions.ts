import { EMAIL_REGEX, IP_REGEX } from "../utils/regexp";
import { isNumber, isString, isValidRegex } from "../utils/util-functions";

export const required = () => (value: string | number, field: string) => {
  if (value && isString(value) && value.trim().length > 0) return;
  if (value && isNumber(value) && value.toString().trim().length > 0) return;
  return {
    error: true,
    errorMessage: "Required",
  };
};

export const regex =
  (regex: RegExp) => (value: string | number, field: string) => {
    if (
      (isString(value) && isValidRegex(value, regex)) ||
      (isNumber(value) && isValidRegex(value.toString(), regex))
    )
      return;
    return {
      error: true,
      errorMessage: `Field has invalid format`,
    };
  };

export const email = () => (value: string, field: string) => {
  if (value && isString(value) && isValidRegex(value, EMAIL_REGEX)) return;
  return {
    error: true,
    errorMessage: `Invalid email address`,
  };
};

export const ipAddress = () => (value: string, field: string) => {
  if (value && isString(value) && isValidRegex(value, IP_REGEX)) return;
  return {
    error: true,
    errorMessage: `Field has invalid ip address`,
  };
};

export const minLength = (length: number) => (value: string, field: string) => {
  if (value && value.length >= length) return;
  return {
    error: true,
    errorMessage: `Min length is ${length}`,
  };
};

export const maxLength = (length: number) => (value: string, field: string) => {
  if (value && value.length <= length) return;
  return {
    error: true,
    errorMessage: `Max length is ${length}`,
  };
};
