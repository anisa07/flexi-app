import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Option } from "@/src/components/autocomplete/Autocomplete";
import { ComponentDashboard } from "./components/component-dashboard/ComponentDashboard";
import { ComponentSelector } from "./components/component-selector/ComponentSelector";
import { generateBlankComponent } from "./utils/generate-blank-component";
import { GeneratedForm } from "./utils/generate-component";
import { SelectedComponent } from "./types/SelectedComponent";
import { GeneratedSchema } from "./types/GeneratedSchema";
import { generateShema } from "./utils/generate-schema";
import { DragAndDropCtx } from "./components/drag-and-drop/DragAndDropCtx";
import { useDargAndDrop } from "./components/drag-and-drop/useDragAndDrop";
import { Rule } from "./components/rule-selector/RuleSelector";
import { EditComponentDialog } from "./components/edit-component-dialog/EditComponentDialog";
import { arrayMove } from "@dnd-kit/sortable";

function App() {
  const [schema, setSchema] = useState<GeneratedSchema>();
  const [editableComponent, setEditableComponent] =
    useState<SelectedComponent>();
  const [dynamicComponents, setDynamicComponents] = useState<
    SelectedComponent[]
  >([]);
  const [selectedComponents, setSelectedComponents] = useState<
    SelectedComponent[]
  >([]);
  const [fieldRules, setFieldRules] = useState<Rule[]>(
    (editableComponent?.component?.validation as Rule[]) || []
  );

  const swapComponents = (
    activeComponentId: string,
    targetComponentId: string
  ) => {
    const activeComponentIndex = selectedComponents.findIndex(
      (selectedComponent) => selectedComponent.id === activeComponentId
    );
    const targetComponentIndex = selectedComponents.findIndex(
      (selectedComponent) => selectedComponent.id === targetComponentId
    );
    if (activeComponentIndex > -1 && targetComponentIndex > -1) {
      setSelectedComponents(
        arrayMove(
          selectedComponents,
          targetComponentIndex,
          activeComponentIndex
        )
      );
      return;
    }

    const activeDynamicComponentIndex = dynamicComponents.findIndex(
      (selectedComponent) => selectedComponent.id === activeComponentId
    );
    const targetDynamicComponentIndex = dynamicComponents.findIndex(
      (selectedComponent) => selectedComponent.id === targetComponentId
    );

    if (activeDynamicComponentIndex > -1 && targetDynamicComponentIndex > -1) {
      setDynamicComponents(
        arrayMove(
          dynamicComponents,
          targetDynamicComponentIndex,
          activeDynamicComponentIndex
        )
      );
      return;
    }
  };

  const handleUpdateComponent = (component: SelectedComponent) => {
    const selectedComponent = selectedComponents.find(
      (selectedComponent) => selectedComponent.id === component.id
    );

    if (selectedComponent) {
      const hasComponentWithSameName = selectedComponents.find(
        (item) =>
          item.component.formComponentName ===
            component.component.formComponentName && component.id !== item.id
      );

      if (hasComponentWithSameName) {
        return component.component.formComponentName;
      }

      const findIndex = selectedComponents.findIndex(
        (c) => c.id === component.id
      );

      if (findIndex !== -1) {
        const copySelectedComponents = [...selectedComponents];
        copySelectedComponents[findIndex] = component;
        setSelectedComponents(copySelectedComponents);
      }
    }

    const dynamicComponent = dynamicComponents.find(
      (dynamicComponent) => dynamicComponent.id === component.id
    );

    if (dynamicComponent) {
      handleUpdateDynamicComponent(component);
    }
  };

  const handleUpdateDynamicComponent = (component: SelectedComponent) => {
    const findIndex = (dynamicComponents || []).findIndex(
      (c) => c.id === component.id
    );
    if (findIndex !== -1) {
      const copyDynamicComponents = [...(dynamicComponents || [])];
      copyDynamicComponents[findIndex] = component;

      const dynamicFormComponent = selectedComponents.find(
        (component) => component.component.type === "dynamicForm"
      );

      if (dynamicFormComponent) {
        handleUpdateComponent({
          ...dynamicFormComponent,
          component: {
            ...dynamicFormComponent.component,
            subComponents: copyDynamicComponents,
          },
        });

        setDynamicComponents(copyDynamicComponents);
      }
    }
  };

  const handleRemoveComponent = (id: string) => {
    const component = selectedComponents.find(
      (component) => component.id === id
    );
    if (component) {
      setSelectedComponents(selectedComponents.filter((c) => c.id !== id));
      if (component.component.type === "dynamicForm") {
        setDynamicComponents([]);
      }
    }
    if (!component) {
      const dynamicComponent = dynamicComponents.find(
        (component) => component.id === id
      );
      if (dynamicComponent) {
        handleRemoveDynamicComponent(id);
      }
    }
  };

  const handleRemoveDynamicComponent = (id: string) => {
    const dynamicFormComponent = selectedComponents.find(
      (component) => component.component.type === "dynamicForm"
    );

    if (dynamicFormComponent) {
      handleUpdateComponent({
        ...dynamicFormComponent,
        component: {
          ...dynamicFormComponent.component,
          subComponents: (dynamicComponents || []).filter((c) => c.id !== id),
        },
      });

      setDynamicComponents(
        (dynamicComponents || []).filter((c) => c.id !== id)
      );
    }
  };

  const handleGenerateSchema = () => {
    setSchema(generateShema(selectedComponents));
  };

  const handleAddComponent = (option: Option) => {
    setSelectedComponents([
      ...selectedComponents,
      generateBlankComponent(option),
    ]);
  };

  const handleAddDynamicComponent = (option: Option) => {
    setDynamicComponents([
      ...dynamicComponents,
      generateBlankComponent(option),
    ]);
  };

  const handleAddDynamicForm = () => {
    const dynamicFormIsAdded = selectedComponents.find(
      (component) => component.component.type === "dynamicForm"
    );

    if (!dynamicFormIsAdded) {
      setSelectedComponents([
        ...selectedComponents,
        generateBlankComponent({
          label: "DynamicForm",
          value: "dynamicForm",
        }),
      ]);
    }
  };

  const swapRules = (activeRule: string, targetRule: string) => {
    const activeRuleIndex = fieldRules.findIndex(
      (rule) => rule.ruleName === activeRule
    );
    const targetRuleIndex = fieldRules.findIndex(
      (rule) => rule.ruleName === targetRule
    );
    if (activeRuleIndex > -1 && targetRuleIndex > -1) {
      setFieldRules(arrayMove(fieldRules, targetRuleIndex, activeRuleIndex));
    }
  };

  const { onDrop } = useDargAndDrop({
    onAddComponent: handleAddComponent,
    onAddDynamicForm: handleAddDynamicForm,
    onAddDynamicComponent: handleAddDynamicComponent,
    swapComponents,
    swapRules,
  });

  return (
    <DragAndDropCtx onDrop={onDrop}>
      <div className="p-5">
        <div className="mb-4 flex flex-col gap-2.5 md:flex-row">
          <ComponentSelector />
        </div>
        <div className="flex flex-col gap-2.5 md:flex-row">
          <div className="flex-1">
            <ComponentDashboard
              dynamicComponents={dynamicComponents}
              selectedComponents={selectedComponents}
              onOpenEditDialog={(editableComponent: SelectedComponent) => {
                setEditableComponent(editableComponent);
              }}
              onRemoveComponent={handleRemoveComponent}
              onSetComponents={setSelectedComponents}
            />
            <Button onClick={handleGenerateSchema} className="mt-4 mr-4">
              Generate schema
            </Button>
            {schema && Object.keys(schema).length > 0 && (
              <Button
                onClick={() => {
                  setSchema({});
                  setSelectedComponents([]);
                }}
                className="mt-4"
              >
                Clean
              </Button>
            )}
          </div>
          {editableComponent && (
            <EditComponentDialog
              fieldRules={fieldRules}
              openDialog={!!editableComponent}
              selectedComponent={editableComponent}
              onCloseDialog={() => {
                setEditableComponent(undefined);
                setFieldRules([]);
              }}
              onUpdateComponent={handleUpdateComponent}
              setFieldRules={setFieldRules}
            />
          )}
          {schema && Object.keys(schema).length > 0 && (
            <div className="flex-1">
              <GeneratedForm schema={schema} />
            </div>
          )}
        </div>
      </div>
    </DragAndDropCtx>
  );
}

export default App;
