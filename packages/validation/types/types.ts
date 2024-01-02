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
  [key: string]: ComponentType;
};

export type ComponentType = {
  name: string;
  label?: string;
  placeholder?: string;
  type: string;
  selectOptions?: { label: string; value: string }[];
  format?: string;
  radioGroupOptions?: { label: string; value: string }[];
  rules?: Function[];
  validationRules?: Array<Function | ComponentType>;
};
