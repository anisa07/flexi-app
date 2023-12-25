import { FormSchema, Error, ValidationRule } from "../types/types";

const applyRule = (
  value: any,
  name: string,
  rules: ((value: any, field: string) => undefined | Error)[]
) => {
  const errors: { [field: string]: Error | Error[] } = {};
  for (const rule of rules) {
    const result = rule(value, name);
    if (result) {
      errors[name] = result;
      break;
    }
  }
  return errors;
};

const applyRuleToArray = (
  value: Record<string, any>,
  validationRules: ValidationRule[]
) => {
  let errors = {};
  for (const validation of validationRules) {
    const error = applyRule(
      value[validation.name],
      validation.name,
      validation.rules
    );
    errors = { ...errors, ...error };
  }
  return [errors];
};

const prepareError = (errors: (Error | undefined | {})[]) => {
  let index = 0;
  while (index <= errors.length - 1) {
    if (Object.keys(errors[index] ?? {}).length === 0) {
      errors.splice(index, 1);
    } else {
      index++;
    }
  }
  return errors;
};

export class Validator {
  schema: FormSchema;
  constructor(schema: FormSchema) {
    this.schema = schema;
  }

  validate(data: Record<string, any>) {
    const errors: { [field: string]: Error | Array<Error | undefined> } = {};
    for (const field in this.schema) {
      const validation = this.schema[field].validationRules;
      const name = this.schema[field].name;
      const value = data[name];
      if (Array.isArray(value)) {
        for (const item of value) {
          const arrayErrors = applyRuleToArray(
            item,
            validation as ValidationRule[]
          );
          const preparedErrorArray = prepareError(arrayErrors);
          errors[name] = Array.isArray(errors[name])
            ? [...errors[name], ...preparedErrorArray]
            : preparedErrorArray;
          if (errors[name]?.length === 0) {
            delete errors[name];
          }
        }
      } else {
        const error = applyRule(
          value,
          name,
          validation as ((v: any) => undefined | Error)[]
        );
        if (error[name]) {
          errors[name] = error[name];
        }
      }
    }
    return errors;
  }
}
