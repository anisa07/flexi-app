export interface Error {
  error: boolean;
  errorMessage: string;
}

export type ValidationRule = {
  name: string;
  rules: ((value: any, field: string) => undefined | Error)[];
};

export type Field = {
  name: string;
  validationRules:
    | ((value: any, field: string) => undefined | Error)[]
    | ValidationRule[];
  field?: string;
};

export type FormSchema = {
  [key: string]: Field;
};
