import { useCallback } from "react";
import { Schema, Validator } from "../validation-schema/validator";

export const validationResolver = (schema: Schema) => {
  //   const validator = new Validator(schema);
  //   return (data: Record<string, any>) => {
  // const errors = validator.validate(data);
  // if (Object.keys(errors).length === 0) {
  //   return {
  //     values: data,
  //     errors: {},
  //   };
  // }
  // return { values: {}, errors };
  //   };
  return useCallback(
    (data: Record<string, any>) => {
      const validator = new Validator(schema);
      const errors = validator.validate(data);
      if (Object.keys(errors).length === 0) {
        return {
          values: data,
          errors: {},
        };
      }
      return { values: {}, errors };
    },
    [schema]
  );
};
