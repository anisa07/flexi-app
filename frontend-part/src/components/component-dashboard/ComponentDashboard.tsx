import { Card } from "@/src/components/ui/card";
import { SelectedComponent } from "@/src/App";
import { DashboardItem } from "../dashboard-item/DashboardItem";
import { useState } from "react";

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
  const [warning, setWarning] = useState("");
  const handleUpdateComponent = (selectedComponent, data, fieldRules) => {
    setWarning("");
    const hasComponentWithSameName = selectedComponents.find(
      (item) => item.component.name === data.name
    );
    if (hasComponentWithSameName) {
      setWarning("Component with the same name already exist");
      return;
    }
    onUpdateComponent({
      ...selectedComponent,
      component: {
        ...selectedComponent.component,
        name: data.name,
        placeholder: data.placeholder,
        label: data.label,
        validation: fieldRules,
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
      {warning && <p>{warning}</p>}
    </>
  );
};
