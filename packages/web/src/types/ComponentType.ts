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
