export interface Schema {
  [field: string]: {
    name: string;
    validationRules: Array<(v: any, f: string) => undefined | Error>;
  };
}

export interface Error {
  error: boolean;
  errorMessage: string;
}

export class Validator {
  schema: Schema;
  constructor(schema: Schema) {
    this.schema = schema;
  }

  validate(data: Record<string, any>) {
    const errors: { [field: string]: Error } = {};
    for (const field in this.schema) {
      const rules = this.schema[field].validationRules;
      const name = this.schema[field].name;
      const value = data[name];
      for (const rule of rules) {
        const result = rule(value, name);
        if (result) {
          errors[name] = result;
          break;
        }
      }
    }
    return errors;
  }
}
