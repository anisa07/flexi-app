import { ComponentType } from "./ComponentType";

export type GeneratedSchema = {
  [key: string]: ComponentType;
  //   {
  //     name: string;
  //     label?: string;
  //     placeholder?: string;
  //     type: string;
  //     selectOptions?: { label: string; value: string }[];
  //     format?: string;
  //     radioGroupOptions?: { label: string; value: string }[];
  //     validationRules: Array<Function | ComponentType>;
  //   };
};
