import { Controller, FieldValues } from "react-hook-form";
import { useFormWrapper } from "@flexi-app/validation/utils/useFormWrapper";

export const GeneratedForm = ({ schema }) => {
  const arrayOfFieldsName = Object.keys(schema).filter(
    (conmponent) => schema[conmponent].type === "array"
  );
  const defaultValues = {};
  for (const key of Object.keys(schema)) {
    if (schema[key].type === "array") {
      defaultValues[key] = [{}];
      for (const component of schema[key].validationRules) {
        defaultValues[key][0] = {
          ...defaultValues[key][0],
          [component.name]: "",
        };
      }
    } else {
      defaultValues[key] = "";
    }
  }

  const onSubmit = (formData: FieldValues) => {
    console.log("formData", formData);
  };

  const {
    handleSubmit,
    fields,
    append,
    remove,
    formState: { errors, isValid },
    control,
  } = useFormWrapper({
    schema,
    defaultValues,
    name: arrayOfFieldsName[0] || "",
    handleSubmit: onSubmit,
    mode: "onChange",
  });

  return (
    <form onSubmit={handleSubmit}>
      {Object.keys(schema).map((componentName) => {
        return schema[componentName].type === "array" ? (
          <div
            style={{ display: "flex", flexDirection: "column" }}
            key={componentName}
          >
            <NewComponents
              {...schema[componentName]}
              defaultValues={defaultValues[componentName][0]}
              append={append}
              remove={remove}
              fields={fields}
              control={control}
              errors={errors}
            />
          </div>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column" }}
            key={componentName}
          >
            <label>{schema[componentName].label}</label>
            <Controller
              render={({ field }) => (
                <NewComponent {...schema[componentName]} {...field} />
              )}
              name={componentName}
              control={control}
            />
            {errors[componentName] && (
              <span style={{ color: "red" }}>
                {errors[componentName]?.errorMessage}
              </span>
            )}
          </div>
        );
      })}
      {isValid && <div>isValid</div>}
      <button type="submit">Submit</button>
    </form>
  );

  // for (const field in schema) {
  //   console.log(field);
  //   const component = detectType(
  //     schema[field].type,
  //     `{...register("${schema[field].name}")} placeholder="${schema[field].placeholder}"`
  //   );
  //   const newPieceOfCode = `
  // <div style={{ display: "flex", flexDirection: "column" }}>
  //   <label>${schema[field].label}</label>
  //   ${component}
  //   {errors.name && (
  //     <span style={{ color: "red" }}>{errors.name?.errorMessage}</span>
  //   )}
  // </div>
  //     `;
  //   code = code + newPieceOfCode;
  // }

  // return `
  //   import { FieldValues, useForm } from "react-hook-form";
  //   import { validationResolver } from "@flexi-app/validation/validation-resolver/validation-resolver";
  //   import { ExampleFormSchema } from "./ExampleFormSchema";

  //   export const ExampleForm = () => {
  //     const {
  //       register,
  //       handleSubmit,
  //       formState: { errors, isValid },
  //     } = useForm({
  //       resolver: validationResolver(ExampleFormSchema),
  //       mode: "onChange",
  //     });

  //     const onSubmit = (formData: FieldValues) => {
  //       console.log("formData", formData);
  //     };

  //     return (
  //       <form onSubmit={handleSubmit(onSubmit)}>
  //         ${code}
  //         <button type="submit">Submit</button>
  //       </form>
  //     )
  //   }
  //   `;
};

const NewComponent = ({ type, field, ...rest }) => {
  if (type === "textarea") {
    return <textarea {...rest} style={{ border: "1px solid black" }} />;
  }
  return <input {...rest} style={{ border: "1px solid black" }} />;
};

const NewComponents = ({
  name,
  append,
  fields,
  control,
  remove,
  validationRules,
  defaultValues,
  errors,
}) => {
  return (
    <>
      <button type="button" onClick={() => append(defaultValues)}>
        append
      </button>
      <ul>
        {fields.map((item, index) => (
          <li key={item.id} style={{ display: "flex" }}>
            {validationRules.map((componentOfArray) => {
              return (
                <div key={componentOfArray.name}>
                  <div>
                    <Controller
                      render={({ field }) => (
                        <input
                          {...field}
                          style={{ border: "1px solid black" }}
                          placeholder={componentOfArray.placeholder || ""}
                        />
                      )}
                      name={`${name}.${index}.${componentOfArray.name}`}
                      control={control}
                    />
                    <p style={{ color: "red", fontSize: "12px", margin: 0 }}>
                      {errors?.[name] &&
                        errors?.[name][index]?.[componentOfArray.name]?.error &&
                        errors?.[name][index]?.[componentOfArray.name]
                          ?.errorMessage}
                    </p>
                  </div>
                </div>
              );
            })}
            <button type="button" onClick={() => remove(index)}>
              Delete
            </button>
            <div style={{ color: "red", fontSize: "12px" }}></div>
          </li>
        ))}
      </ul>
    </>
  );
};
