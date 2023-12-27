import { useForm, useFieldArray, FieldValues } from "react-hook-form";
import { validationResolver } from "../validation-resolver/validation-resolver";
import { FormSchema } from "../types/types";

type useFormWrapperProps = {
  schema: FormSchema;
  defaultValues: any; // replace 'any' with the appropriate type
  nameForFieldsArray?: string;
  handleSubmit: (data: any) => void; // replace 'any' with the appropriate type
  mode: "onChange" | "onBlur" | "onSubmit" | "onTouched";
};

export const useFormWrapper = ({
  schema,
  defaultValues,
  nameForFieldsArray = "",
  handleSubmit: customSubmitHandler,
  mode = "onSubmit",
}: useFormWrapperProps) => {
  const { control, handleSubmit, formState, register } = useForm({
    resolver: validationResolver(schema),
    defaultValues,
    mode,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: nameForFieldsArray,
  });

  const handleSuctomSubmit = (values: FieldValues) => {
    if (values[""]) {
      delete values[""];
    }
    console.log("values", values);
    customSubmitHandler(values);
  };

  const submitForm = handleSubmit(handleSuctomSubmit);
  console.log("formState", formState);
  return {
    fields,
    append,
    remove,
    handleSubmit: submitForm,
    control,
    formState,
    register,
  };
};
