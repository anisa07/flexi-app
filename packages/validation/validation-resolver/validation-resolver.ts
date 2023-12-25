import { useCallback } from "react";
import { Validator } from "../validation-schema/validator";
import { FormSchema } from "../types/types";

export const validationResolver = (schema: FormSchema) => {
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
