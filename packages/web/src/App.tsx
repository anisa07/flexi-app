import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Option } from "@/src/components/autocomplete/Autocomplete";
import { Button } from "@/src/components/ui/button";
// import { ValidationMap } from "@flexi-app/validation/functions/validation-functions";
import { ComponentDashboard } from "./components/component-dashboard/ComponentDashboard";
import { ComponentSelector } from "./components/component-selector/ComponentSelector";
import { CheckboxWithhLabel } from "./components/checkbox/CheckboxWithLabel";
// import CodeSnippet from "./components/code-snippet/CodeSnippet";
import { generateBlankComponent } from "./utils/generate-blank-component";
import { GeneratedForm } from "./utils/generate-component";
import { SelectedComponent } from "./types/SelectedComponent";
import { GeneratedSchema } from "./types/GeneratedSchema";
import { generateShema } from "./utils/generate-schema";

function App() {
  const [schema, setSchema] = React.useState<GeneratedSchema>();
  // const [newForm, setNewForm] = React.useState("");
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
    setSelectedComponents([
      ...selectedComponents,
      generateBlankComponent(option),
    ]);
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
    setSchema(generateShema(selectedComponents));
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
        generateBlankComponent({
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
