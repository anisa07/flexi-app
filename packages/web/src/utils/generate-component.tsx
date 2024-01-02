import {
  Control,
  FieldErrors,
  FieldValues,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
} from "react-hook-form";
import { useFormWrapper } from "@flexi-app/validation/utils/useFormWrapper";
import { detectRenderComponent } from "./detect-render-component";
import { RenderInputComponent } from "../components/rendered-components/RenderInputComponent";
import { RenderCheckComponent } from "../components/rendered-components/RenderCheckComponent";
import { RenderSelectComponent } from "../components/rendered-components/RenderSelectComponent";
import { RenderDatepickerComponent } from "../components/rendered-components/RenderDatepickerComponent";
import { RenderRadioGroupComponent } from "../components/rendered-components/RenderRadioGroupComponent";
import { GeneratedSchema } from "../types/GeneratedSchema";

export const GeneratedForm = ({ schema }: { schema: GeneratedSchema }) => {
  if (Object.keys(schema).length === 0) {
    return <></>;
  }

  const arrayOfFieldsName = Object.keys(schema).filter(
    (conmponent) => schema[conmponent].type === "array"
  );
  const defaultValues: Record<string, any> = {};
  for (const key of Object.keys(schema)) {
    if (schema[key].type === "array") {
      defaultValues[key] = [{}];
      for (const component of schema[key].validationRules || []) {
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
    nameForFieldsArray: arrayOfFieldsName[0] || "",
    handleSubmit: onSubmit,
    mode: "onChange",
  });

  return (
    <form onSubmit={handleSubmit}>
      {Object.keys(schema).map((componentName) => {
        return schema[componentName].type === "array" ? (
          <div className="flex flex-col" key={componentName}>
            <NewComponents
              defaultValues={defaultValues[componentName][0]}
              append={append}
              remove={remove}
              fields={fields}
              control={control}
              errors={errors}
              {...schema[componentName]}
            />
          </div>
        ) : (
          <div
            className="flex flex-col first:mt-0 mt-2 mb-2"
            key={componentName}
          >
            <NewComponent
              componentName={componentName}
              control={control}
              error={errors[componentName]?.error}
              label={schema[componentName].label}
              {...schema[componentName]}
            />
            {errors[componentName] && (
              <span className="mb-2 text-red-700">
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
};

interface NewComponentType {
  type: string;
  componentName: string;
  control: Control<{}, any>;
  label?: string;
  error?: boolean;
  placeholder?: string;
  radioGroupOptions?: { label: string; value: string }[];
  selectOptions?: { label: string; value: string }[];
  format?: string;
}

const NewComponent = ({ type, ...rest }: NewComponentType) => {
  const renderType = detectRenderComponent(type);

  if (renderType === "renderInput") {
    return <RenderInputComponent type={type} {...rest} />;
  }

  if (renderType === "renderCheck") {
    return <RenderCheckComponent type={type} {...rest} />;
  }

  if (renderType === "renderSelect") {
    return <RenderSelectComponent type={type} {...rest} />;
  }

  if (renderType === "renderDatepicker") {
    return <RenderDatepickerComponent type={type} {...rest} />;
  }

  if (renderType === "renderRadiogroup") {
    return <RenderRadioGroupComponent type={type} {...rest} />;
  }
};

interface NewComponentsValidationRules {
  type: string;
  name: string;
  label?: string;
  error?: boolean;
  placeholder?: string;
  radioGroupOptions: { label: string; value: string }[];
  selectOptions: { label: string; value: string }[];
  format: string;
}

interface NewComponentsType {
  name: string;
  append: UseFieldArrayAppend<{}, never>;
  remove: UseFieldArrayRemove;
  control: Control<{}, any>;
  fields: Record<"id", string>[];
  errors: FieldErrors<{}>;
  defaultValues: Record<string, string>;
  validationRules: NewComponentsValidationRules[];
}

const NewComponents = ({
  name,
  append,
  fields,
  control,
  remove,
  validationRules,
  defaultValues,
  errors,
}: NewComponentsType) => {
  return (
    <>
      <button
        type="button"
        onClick={() => {
          append({ ...defaultValues });
        }}
      >
        Append
      </button>
      <ul>
        {fields.map((item, index) => (
          <li key={item.id} style={{ display: "flex" }}>
            {validationRules.map((componentOfArray) => {
              return (
                <div key={componentOfArray.name}>
                  <NewComponent
                    componentName={`${name}.${index}.${componentOfArray.name}`}
                    control={control}
                    error={
                      errors?.[name] &&
                      errors?.[name][index]?.[componentOfArray.name]?.error
                    }
                    label={componentOfArray.label}
                    {...componentOfArray}
                  />
                  <p
                    className="text-red-700"
                    style={{ fontSize: "12px", margin: 0 }}
                  >
                    {errors?.[name] &&
                      errors?.[name][index]?.[componentOfArray.name]?.error &&
                      errors?.[name][index]?.[componentOfArray.name]
                        ?.errorMessage}
                  </p>
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
