import {
  email,
  minLength,
  maxLength,
  required,
  regex,
} from "../../functions/validation-functions";

export const ExampleFormSchema = {
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
