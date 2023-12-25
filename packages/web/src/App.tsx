import React from "react";
import { ComponentDashboard } from "./components/component-dashboard/ComponentDashboard";
import { ComponentSelector } from "./components/component-selector/ComponentSelector";
import { Option } from "@/src/components/autocomplete/Autocomplete";
import { v4 as uuidv4 } from "uuid";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Button } from "@/src/components/ui/button";
import { ValidationMap } from "@flexi-app/validation/functions/validation-functions";
// import CodeSnippet from "./components/code-snippet/CodeSnippet";
import { GeneratedForm } from "./utils/generate-component";
import { CheckboxWithhLabel } from "./components/checkbox-with-label/CheckboxWithLabel";

export interface SelectedComponent {
  name: string;
  id: string;
  component: {
    type: string;
    formComponentName: string;
    label: string;
    placeholder: string;
    validation: Array<{
      ruleName: string;
      withParam: boolean;
      param?: any;
    }>;
    subComponents: SelectedComponent[];
  };
}

export const generateComponent = (option: Option): SelectedComponent => ({
  name: option.label,
  id: uuidv4(),
  component: {
    type: option.value,
    formComponentName: "",
    label: "",
    placeholder: "",
    validation: [],
    subComponents: [],
  },
});

function App() {
  // This is a simple schema for the form
  const [schema, setSchema] = React.useState<{
    [name: string]: {
      name: string;
      validationRules: Array<(p?: any) => any>;
    };
  }>();

  const [newForm, setNewForm] = React.useState("");

  const [addDynamicForm, setAddDynamicForm] = React.useState(false);

  const [selectedComponents, setSelectedComponents] = React.useState<
    SelectedComponent[]
  >([]);

  const handleUpdateComponent = (component: SelectedComponent) => {
    const findIndex = selectedComponents.findIndex(
      (c) => c.id === component.id
    );
    if (findIndex !== -1) {
      const copySelectedComponents = [...selectedComponents];
      copySelectedComponents[findIndex] = component;
      setSelectedComponents(copySelectedComponents);
    }
  };

  const handleAddComponent = (option: Option) => {
    setSelectedComponents([...selectedComponents, generateComponent(option)]);
  };

  const handleRemoveComponent = (id: string) => {
    const component = selectedComponents.find(
      (component) => component.id === id
    );
    if (component?.component.type === "dynamicForm") {
      setAddDynamicForm(false);
    }
    setSelectedComponents(selectedComponents.filter((c) => c.id !== id));
  };

  const handleGenerateSchema = () => {
    console.log("selectedComponents", selectedComponents);
    const newSchema = {};

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
      } else {
        newSchema[name] = {
          name,
          type: "array",
          validationRules: [],
        };
        for (const dynamicComponent of selected.component.subComponents) {
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
          });
        }
      }
    }

    console.log("newSchema", newSchema);
    if (Object.keys(newSchema).length > 0) {
      setSchema(newSchema);
      // setNewForm(generateForm(newSchema));
      // generateForm(newSchema);
    }
  };

  const handleAddDynamicForm = (add: boolean) => {
    const selectedComponentsCopy = [...selectedComponents];
    if (!add) {
      const dynamicFormIndex = selectedComponents.findIndex(
        (component) => component.name === "dynamicForm"
      );
      selectedComponentsCopy.splice(dynamicFormIndex, 1);
      setSelectedComponents(selectedComponentsCopy);
    } else {
      setSelectedComponents([
        ...selectedComponents,
        generateComponent({
          label: "DynamicForm",
          value: "dynamicForm",
        }),
      ]);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-5">
        <div className="mb-4 flex flex-col gap-2.5 md:flex-row">
          <ComponentSelector onSelectComponents={handleAddComponent} />
          <CheckboxWithhLabel
            label="Add Dynamic form"
            checked={addDynamicForm}
            onCheck={(v) => {
              setAddDynamicForm(v);
              handleAddDynamicForm(v);
            }}
          />
        </div>
        <div className="flex flex-col gap-2.5 md:flex-row">
          <div className="flex-1">
            <ComponentDashboard
              selectedComponents={selectedComponents}
              onRemoveComponent={handleRemoveComponent}
              onUpdateComponent={handleUpdateComponent}
            />
            <Button onClick={handleGenerateSchema} className="mt-4">
              Generate schema
            </Button>
          </div>
          <div className="flex-1">
            {/* <CodeSnippet code={newForm} /> */}
            {schema && <GeneratedForm schema={schema} />}
          </div>
        </div>
      </div>
    </DndProvider>
  );
}

export default App;
