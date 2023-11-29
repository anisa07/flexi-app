import React from "react";
import { ComponentDashboard } from "./components/component-dashboard/ComponentDashboard";
import { ComponentSelector } from "./components/component-selector/ComponentSelector";
import { Option } from "@/src/components/autocomplete/Autocomplete";
import { v4 as uuidv4 } from "uuid";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Button } from "@/src/components/ui/button";
// TODO go to validation-part (npm package????)
import { ValidationMap } from "../../validation-part/functions/validation-functions";

export interface SelectedComponent {
  name: string;
  id: string;
  component: {
    type: string;
    label: string;
    placeholder: string;
    name: string;
    validation: Array<{
      name: string;
      rule: string;
      withParam: boolean;
      param?: any;
    }>;
  };
}

const generateComponent = (option: Option) => ({
  name: option.label,
  id: uuidv4(),
  component: {
    type: option.value,
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

  const handleSelectComponent = (option: Option) => {
    setSelectedComponents([...selectedComponents, generateComponent(option)]);
  };

  const handleRemoveComponent = (id: string) => {
    setSelectedComponents(selectedComponents.filter((c) => c.id !== id));
  };

  const handleGenerateSchema = () => {
    console.log("selectedComponents", selectedComponents);
    const newSchema = {};

    for (const selected of selectedComponents) {
      const name = selected.component.name;
      if (!name) continue;
      newSchema[name] = {
        name,
        validationRules: selected.component.validation.map((r) => {
          const validationFunction = ValidationMap.get(r.name);
          if (r.withParam) {
            return validationFunction && validationFunction(r.param);
          } else {
            return validationFunction && validationFunction();
          }
        }),
      };
    }
    setSchema(newSchema);
    console.log("newSchema", newSchema);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-5">
        <div className="mb-4">
          <ComponentSelector onSelectComponents={handleSelectComponent} />
        </div>
        <div className="mb-4">
          <ComponentDashboard
            selectedComponents={selectedComponents}
            onRemoveComponent={handleRemoveComponent}
            onUpdateComponent={handleUpdateComponent}
          />
        </div>
        <Button onClick={handleGenerateSchema}>Generate schema</Button>
      </div>
    </DndProvider>
  );
}

export default App;
