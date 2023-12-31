import { Card } from "@/src/components/ui/card";
import { DashboardItem } from "../dashboard-item/DashboardItem";
import { FieldValues } from "react-hook-form";
import { Rule } from "../rule-selector/RuleSelector";
import { SelectedComponent } from "@/src/types/SelectedComponent";

interface ComponentDashboardProps {
  selectedComponents: SelectedComponent[];
  onUpdateComponent: (component: SelectedComponent) => void;
  onRemoveComponent: (id: string) => void;
}

export const ComponentDashboard = ({
  selectedComponents,
  onRemoveComponent,
  onUpdateComponent,
}: ComponentDashboardProps) => {
  const handleUpdateComponent = (
    selectedComponent: SelectedComponent,
    data: FieldValues,
    fieldRules: Rule[]
  ) => {
    const hasComponentWithSameName = selectedComponents.find(
      (item) =>
        item.component.formComponentName === data.formComponentName &&
        selectedComponent.id !== item.id
    );
    if (hasComponentWithSameName) {
      return data.formComponentName;
    }

    onUpdateComponent({
      ...selectedComponent,
      component: {
        ...selectedComponent.component,
        format: data.format,
        formComponentName: data.formComponentName,
        placeholder: data.placeholder,
        label: data.label,
        validation: fieldRules,
        radioGroupOptions: data.radiogroup,
      },
    });
  };
  return (
    <>
      <Card className="py-2 px-3">
        {selectedComponents.length > 0 ? (
          selectedComponents.map((component) => (
            <DashboardItem
              key={component.id}
              selectedComponent={component}
              onRemoveComponent={onRemoveComponent}
              onUpdateComponent={handleUpdateComponent}
            />
          ))
        ) : (
          <p className="text-center">No components added</p>
        )}
      </Card>
    </>
  );
};
