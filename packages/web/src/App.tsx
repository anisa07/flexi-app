import React from "react";
import { ComponentDashboard } from "./components/component-dashboard/ComponentDashboard";
import { ComponentSelector } from "./components/component-selector/ComponentSelector";
import { Option } from "@/src/components/autocomplete/Autocomplete";
import { v4 as uuidv4 } from "uuid";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Button } from "@/src/components/ui/button";
import { ValidationMap } from "@flexi-app/validation/functions/validation-functions";
import CodeSnippet from "./components/code-snippet/CodeSnippet";
import { generateForm } from "./utils/generate-component";

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
  };
}

const generateComponent = (option: Option): SelectedComponent => ({
  name: option.label,
  id: uuidv4(),
  component: {
    type: option.value,
    formComponentName: "",
    label: "",
    placeholder: "",
    validation: [],
  },
});

function App() {
  const [selectedComponents, setSelectedComponents] = React.useState<
    SelectedComponent[]
  >([]);
  // This is a simple schema for the form
  const [schema, setSchema] = React.useState<{
    [name: string]: {
      name: string;
      validationRules: Array<(p?: any) => any>;
    };
  }>();

  const [newForm, setNewForm] = React.useState("");

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
    setSelectedComponents(selectedComponents.filter((c) => c.id !== id));
  };

  const handleGenerateSchema = () => {
    console.log("selectedComponents", selectedComponents);
    const newSchema = {};

    for (const selected of selectedComponents) {
      const name = selected.component.formComponentName;
      if (!name) continue;

      newSchema[name] = {
        name,
        label: selected.component.label,
        placeholder: selected.component.label,
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
    }
    console.log("newSchema", newSchema);
    if (Object.keys(newSchema).length > 0) {
      setNewForm(generateForm(newSchema));
    }
  };

  console.log("selectedComponents", selectedComponents);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-5">
        <div className="mb-4">
          <ComponentSelector onSelectComponents={handleAddComponent} />
        </div>
        <div className="mb-4">
          <ComponentDashboard
            selectedComponents={selectedComponents}
            onRemoveComponent={handleRemoveComponent}
            onUpdateComponent={handleUpdateComponent}
          />
        </div>
        <Button onClick={handleGenerateSchema}>Generate schema</Button>
        <CodeSnippet code={newForm} />
      </div>
    </DndProvider>
  );
}

export default App;
