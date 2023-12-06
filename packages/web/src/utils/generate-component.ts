import { detectType } from "./detect-type";

export const generateForm = (schema) => {
  let code = "";

  for (const field in schema) {
    console.log(field);
    const component = detectType(
      schema[field].type,
      `{...register("${schema[field].name}")} placeholder="${schema[field].placeholder}"`
    );
    const newPieceOfCode = `
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label>${schema[field].label}</label>
          ${component}
          {errors.name && (
            <span style={{ color: "red" }}>{errors.name?.errorMessage}</span>
          )}
        </div>
      `;
    code = code + newPieceOfCode;
  }

  return `
    import { FieldValues, useForm } from "react-hook-form";
    import { validationResolver } from "@flexi-app/validation/validation-resolver/validation-resolver";
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
        console.log("formData", formData);
      };
  
      return (
        <form onSubmit={handleSubmit(onSubmit)}>
          ${code}
          <button type="submit">Submit</button>
        </form>
      )
    }
    `;
};
