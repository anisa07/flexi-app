import { ValidationMap } from "@flexi-app/validation/functions/validation-functions";
import { GeneratedSchema } from "../types/GeneratedSchema";
import { SelectedComponent } from "../types/SelectedComponent";

export const generateShema = (
  selectedComponents: SelectedComponent[]
): GeneratedSchema => {
  console.log("selectedComponents", selectedComponents);
  const newSchema = {} as GeneratedSchema;

  for (const selected of selectedComponents) {
    const name = selected.component.formComponentName;
    if (!name) continue;

    if (selected.component.type !== "dynamicForm") {
      newSchema[name] = {
        name,
        label: selected.component.label,
        placeholder: selected.component.placeholder,
        type: selected.component.type,
        validationRules: selected.component.validation.map((r) => {
          const validationFunction = ValidationMap.get(r.ruleName);
          if (r.withParam) {
            return validationFunction && validationFunction(r.param);
          } else {
            return validationFunction && validationFunction();
          }
        }),
      };
      if (selected.component.type === "select") {
        newSchema[name].selectOptions = [
          { label: "exampleName", value: "exampleValue" },
        ];
      }
      if (selected.component.type === "datepicker") {
        newSchema[name].format = selected.component.format;
      }
      if (selected.component.type === "radiogroup") {
        newSchema[name].radioGroupOptions =
          selected.component.radioGroupOptions;
      }
    } else {
      newSchema[name] = {
        name,
        type: "array",
        validationRules: [],
      };
      for (const dynamicComponent of selected.component.subComponents) {
        const selectOptions = [];
        let radioGroupOptions: { label: string; value: string }[] = [];
        let format = "";
        if (dynamicComponent.component.type === "select") {
          selectOptions.push({ label: "exampleName", value: "exampleValue" });
        }
        if (dynamicComponent.component.type === "datepicker") {
          format = dynamicComponent.component.format;
        }
        if (dynamicComponent.component.type === "radiogroup") {
          radioGroupOptions = dynamicComponent.component.radioGroupOptions;
        }
        if (newSchema[name].validationRules) {
        }

        newSchema[name].validationRules =
          newSchema[name].validationRules &&
          Array.isArray(newSchema[name].validationRules)
            ? newSchema[name].validationRules
            : [];

        newSchema[name].validationRules.push({
          name: dynamicComponent.component.formComponentName,
          label: dynamicComponent.component.label,
          placeholder: dynamicComponent.component.placeholder,
          type: dynamicComponent.component.type,
          rules: dynamicComponent.component.validation.map((r) => {
            const validationFunction = ValidationMap.get(r.ruleName);
            if (r.withParam) {
              return validationFunction && validationFunction(r.param);
            } else {
              return validationFunction && validationFunction();
            }
          }),
          selectOptions,
          format,
          radioGroupOptions,
        });
      }
    }
  }

  console.log("newSchema", newSchema);
  return newSchema;
};
