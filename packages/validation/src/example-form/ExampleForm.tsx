import { FieldValues, useForm } from "react-hook-form";
import { validationResolver } from "../../validation-resolver/validation-resolver";
import { ExampleFormSchema } from "./ExampleFormSchema";

export const ExampleForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: validationResolver(ExampleFormSchema),
    mode: "onChange",
  });

  const onSubmit = (formData: FieldValues) => {
    console.log("isValid", isValid);
    console.log(`You said: ${JSON.stringify(formData, null, 4)}`);
  };

  console.log("errors", errors);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <label>Name</label>
        <input type="text" {...register("name")} />
        {errors.name && (
          <span style={{ color: "red" }}>{errors.name?.errorMessage}</span>
        )}
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <label>Email</label>
        <input type="text" {...register("email")} />
        {errors.email && (
          <span style={{ color: "red" }}>{errors.email?.errorMessage}</span>
        )}
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <label>Code</label>
        <input type="text" {...register("code")} />
        {errors.code && (
          <span style={{ color: "red" }}>{errors.code?.errorMessage}</span>
        )}
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};
