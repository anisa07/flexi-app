import { Controller } from "react-hook-form";
import { ExampleFormSchema2 } from "./ExampleFormSchema";
import { useFormWrapper } from "../../utils/useFormWrapper";

export const ExampleForm2 = () => {
  const customSubmitHandler = (data) => console.log(data);

  const {
    fields,
    append,
    remove,
    handleSubmit,
    control,
    formState: { isValid, errors },
  } = useFormWrapper({
    schema: ExampleFormSchema2,
    defaultValues: {
      info: [{ email: "", user: "" }],
      name: "",
    },
    nameForFieldsArray: "info",
    handleSubmit: customSubmitHandler,
  });

  console.log("isValid", isValid);
  console.log("errors", errors);

  return (
    <form onSubmit={handleSubmit}>
      <button type="button" onClick={() => append({ email: "" })}>
        append
      </button>
      <ul>
        {fields.map((item, index) => (
          <li key={item.id} style={{ display: "flex" }}>
            <div>
              <Controller
                render={({ field }) => <input {...field} placeholder="Email" />}
                name={`info.${index}.email`}
                control={control}
              />
              <p style={{ color: "red", fontSize: "12px", margin: 0 }}>
                {errors?.info &&
                  errors?.info[index]?.email?.error &&
                  errors?.info[index]?.email?.errorMessage}
              </p>
            </div>
            <div>
              <Controller
                render={({ field }) => <input {...field} placeholder="User" />}
                name={`info.${index}.user`}
                control={control}
              />
              <p style={{ color: "red", fontSize: "12px", margin: 0 }}>
                {errors?.info &&
                  errors?.info[index]?.user?.error &&
                  errors?.info[index]?.user?.errorMessage}
              </p>
            </div>
            <button type="button" onClick={() => remove(index)}>
              Delete
            </button>
            <div style={{ color: "red", fontSize: "12px" }}></div>
          </li>
        ))}
      </ul>
      <div>
        <Controller
          render={({ field }) => <input {...field} placeholder="Name" />}
          name={"name"}
          control={control}
        />
        <p style={{ color: "red", fontSize: "12px", margin: 0 }}>
          {errors?.name?.error && errors?.name?.errorMessage}
        </p>
      </div>
      <input type="submit" />
    </form>
  );
};
