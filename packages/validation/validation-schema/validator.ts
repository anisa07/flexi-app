export interface Schema {
  [field: string]: ValidationRule;
}

interface ValidationRule {
  name: string;
  validationRules: Array<(v: any, f: string) => undefined | Error>;
}

export interface Error {
  error: boolean;
  errorMessage: string;
}

const applyRule = (
  value: any,
  name: string,
  rules: ((v: any) => undefined | Error)[]
) => {
  const errors: { [field: string]: Error | Error[] } = {};
  for (const rule of rules) {
    const result = rule(value);
    if (result) {
      errors[name] = result;
      break;
    }
  }
  return errors;
};

const applyRuleToArray = (
  value: Record<string, any>,
  rules: {
    name: string;
    rule: (v: any) => undefined | Error;
  }[]
) => {
  const errors = [];
  for (const validation of rules) {
    const error = validation.rule(value[validation.name]);
    console.log("applyRuleToArray error", error);
    errors.push(error);
  }
  console.log("applyRuleToArray errors", errors);
  return errors;
};

export class Validator {
  schema: Schema;
  constructor(schema: Schema) {
    this.schema = schema;
  }

  validate(data: Record<string, any>) {
    const errors: { [field: string]: Error | (Error | undefined)[] } = {};
    for (const field in this.schema) {
      const rules = this.schema[field].validationRules;
      const name = this.schema[field].name;
      const value = data[name];
      if (Array.isArray(value)) {
        for (const item of value) {
          const arrayErrors = applyRuleToArray(item, rules);

          errors[name] = Array.isArray(errors[name])
            ? [...errors[name], ...arrayErrors]
            : arrayErrors;
        }
        console.log("errors[name]", errors[name]);
        if (Array.isArray(errors[name])) {
          const nonUndefinedErrors = errors[name].some(
            (error: Error) => error !== undefined
          );
          if (!nonUndefinedErrors) {
            delete errors[name];
          }
        }
        console.log("errors", errors);
      } else {
        const error = applyRule(value, name, rules);
        if (error) {
          errors[name] = error;
          break;
        }
      }
    }
    return errors;
  }
}
