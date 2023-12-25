import {
  email,
  minLength,
  maxLength,
  required,
  regex,
} from "../../functions/validation-functions";
import { FormSchema } from "../../types/types";

export const ExampleFormSchema: FormSchema = {
  email: {
    name: "email",
    validationRules: [required(), email()],
  },
  name: {
    name: "name",
    validationRules: [required(), minLength(5), maxLength(10)],
  },
  code: {
    name: "code",
    validationRules: [required(), regex(/\d{2}[a-z]{2}\d{2}/)],
  },
};

export const ExampleFormSchema2: FormSchema = {
  name: {
    name: "name",
    validationRules: [required(), minLength(5), maxLength(10)],
  },
  info: {
    name: "info",
    field: "array",
    validationRules: [
      {
        name: "email",
        // type?
        // placeholder?
        // label
        rules: [email()],
      },
      {
        name: "user",
        rules: [required(), minLength(5)],
      },
    ],
  },
};
