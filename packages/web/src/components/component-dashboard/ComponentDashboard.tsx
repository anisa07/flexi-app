import { Card } from "@/src/components/ui/card";
import { DashboardItem } from "../dashboard-item/DashboardItem";
import { SelectedComponent } from "@/src/types/SelectedComponent";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ReactElement } from "react";

interface ComponentDashboardProps {
  selectedComponents: SelectedComponent[];
  dynamicDashboard?: boolean;
  dynamicComponents: SelectedComponent[];
  onOpenEditDialog: (component: SelectedComponent) => void;
  onRemoveComponent: (id: string) => void;
  onSetComponents?: (compoents: SelectedComponent[]) => void;
}

export const ComponentDashboard = ({
  selectedComponents,
  dynamicDashboard,
  dynamicComponents,
  onOpenEditDialog,
  onRemoveComponent,
}: ComponentDashboardProps) => {
  const { setNodeRef } = useDroppable({
    id: dynamicDashboard ? "dynamic-dashboard" : "dashboard",
  });

  return (
    <>
      <Card className="py-2 px-3 w-[100%]" ref={setNodeRef}>
        {selectedComponents?.length > 0 ? (
          <SortableContext
            items={selectedComponents}
            strategy={verticalListSortingStrategy}
          >
            {selectedComponents.map((component) => (
              <SortableItem id={component.id} key={component.id}>
                <DashboardItem
                  key={component.id}
                  selectedComponent={component}
                  onRemoveComponent={onRemoveComponent}
                  onOpenEditDialog={onOpenEditDialog}
                  dynamicComponents={dynamicComponents}
                />
              </SortableItem>
            ))}
          </SortableContext>
        ) : (
          <p className="text-center">No components added</p>
        )}
      </Card>
    </>
  );
};

function SortableItem({
  id,
  children,
}: {
  id: string;
  children: ReactElement;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id,
      data: {
        type: "selected-item",
      },
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    display: "inline-block",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
}
