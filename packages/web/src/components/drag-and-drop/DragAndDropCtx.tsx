import { ReactElement } from "react";
// import { DndContext, rectIntersection, DragEndEvent } from "@dnd-kit/core";
import {
  DndContext,
  DragEndEvent,
  //   closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  rectIntersection,
} from "@dnd-kit/core";
import {
  //   arrayMove,
  //   SortableContext,
  sortableKeyboardCoordinates,
  //   verticalListSortingStrategy,
} from "@dnd-kit/sortable";

export const DragAndDropCtx = ({
  children,
  onDrop,
}: {
  children: ReactElement;
  onDrop: (event: DragEndEvent) => void;
}) => {
  const sensors = useSensors(
    // useSensor(PointerSensor),
    // useSensor(KeyboardSensor, {
    //   coordinateGetter: sortableKeyboardCoordinates,
    // })
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  return (
    <DndContext
      sensors={sensors}
      //   collisionDetection={closestCenter}
      collisionDetection={rectIntersection}
      onDragEnd={onDrop}
      //   onDragStart={(event) => {
      //     event?.activatorEvent?.preventDefault();
      //     console.log("onDragStart", event);
      //   }}
    >
      {children}
    </DndContext>
  );
};
