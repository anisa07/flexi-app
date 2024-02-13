import { Badge } from "@/src/components/ui/badge";
import { X, Edit } from "lucide-react";
import { SelectedComponent } from "@/src/types/SelectedComponent";
import { ComponentDashboard } from "../component-dashboard/ComponentDashboard";

export interface DashboardItemProps {
  selectedComponent: SelectedComponent;
  dynamicComponents?: SelectedComponent[];
  onOpenEditDialog: (component: SelectedComponent) => void;
  onRemoveComponent: (id: string) => void;
}

export const DashboardItem = ({
  selectedComponent,
  dynamicComponents,
  onOpenEditDialog,
  onRemoveComponent,
}: DashboardItemProps) => {
  const isComponentDynamicForm = () =>
    selectedComponent.component.type === "dynamicForm";

  return (
    <div
      className={`mr-2 mb-2 p-1 border-2 border-solid rounded-sm inline-block ${
        isComponentDynamicForm() ? "bg-slate-200" : "transparent"
      } max-w-[300px]`}
    >
      <Badge key={selectedComponent.id}>
        <div className="flex flex-col">
          <div className="flex items-center">
            <Edit
              className="mr-1 h-4 w-4"
              onMouseDown={(e) => {
                e.preventDefault();
                onOpenEditDialog(selectedComponent);
              }}
            />
            <p className="text-sm flex-1">
              {selectedComponent.component.label ||
                selectedComponent.component.formComponentName ||
                selectedComponent.name}
            </p>
            <X
              className="ml-1 h-4 w-4"
              onMouseDown={(e) => {
                e.preventDefault();
                onRemoveComponent(selectedComponent.id);
              }}
            />
          </div>
          {isComponentDynamicForm() && (
            <div className="my-1 min-w-[250px] flex">
              <ComponentDashboard
                dynamicDashboard={true}
                dynamicComponents={[]}
                selectedComponents={dynamicComponents || []}
                onRemoveComponent={onRemoveComponent}
                onOpenEditDialog={onOpenEditDialog}
              />
            </div>
          )}
        </div>
      </Badge>
    </div>
  );
};
