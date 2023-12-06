import React from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { validationResolver } from "../../validation-resolver/validation-resolver";
import { ExampleFormSchema2 } from "./ExampleFormSchema";

export const ExampleForm2 = () => {
  const {
    control,
    handleSubmit,
    formState: { isValid, errors },
  } = useForm({
    resolver: validationResolver(ExampleFormSchema2),
    // defaultValues: {}; you can populate the fields by this attribute
    defaultValues: {
      emails: [{ email: "" }],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "emails",
  });

  console.log("isValid", isValid);
  console.log("errors", errors);

  return (
    <form onSubmit={handleSubmit((data) => console.log(data))}>
      <ul>
        {fields.map((item, index) => (
          <li key={item.id}>
            <Controller
              render={({ field }) => <input {...field} />}
              name={`emails.${index}.email`}
              control={control}
            />
            <button type="button" onClick={() => remove(index)}>
              Delete
            </button>
            <div style={{ color: "red", fontSize: "12px" }}>
              {errors?.emails &&
                errors?.emails[index]?.error &&
                errors?.emails[index]?.errorMessage}
            </div>
          </li>
        ))}
      </ul>
      <button type="button" onClick={() => append({ email: "" })}>
        append
      </button>
      <input type="submit" />
    </form>
  );
};
