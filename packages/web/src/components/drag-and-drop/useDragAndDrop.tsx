import { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { Option } from "../autocomplete/Autocomplete";

export const useDargAndDrop = ({
  onAddComponent,
  onAddDynamicForm,
  onAddDynamicComponent,
  swapComponents,
  swapRules,
}: {
  onAddDynamicComponent?: (option: Option) => void;
  onAddComponent?: (option: Option) => void;
  onAddDynamicForm?: () => void;
  swapComponents?: (
    activeComponentId: string,
    targetComponentId: string
  ) => void;
  swapRules?: (activeRule: string, targetRule: string) => void;
}) => {
  const handleDrop = (event: DragEndEvent) => {
    const { active, over } = event;
    console.log(event);
    if (
      active &&
      onAddDynamicForm &&
      onAddComponent &&
      active?.data?.current?.type === "selected-component" &&
      over?.id === "dashboard"
    ) {
      if (active?.data?.current?.value?.value === "dynamicForm") {
        onAddDynamicForm();
      } else {
        onAddComponent(event.active?.data?.current?.value);
      }
    }
    if (
      active &&
      onAddDynamicComponent &&
      active?.data?.current?.type === "selected-component" &&
      active?.data?.current?.value?.value !== "dynamicForm" &&
      over?.id === "dynamic-dashboard"
    ) {
      onAddDynamicComponent(event.active?.data?.current?.value);
    }

    if (
      active &&
      swapComponents &&
      active?.data?.current?.type === "selected-item" &&
      over?.data?.current?.type === "selected-item"
    ) {
      swapComponents(event.active?.id as string, event.over?.id as string);
    }

    if (
      active &&
      swapRules &&
      active?.data?.current?.type === "rule-item" &&
      over?.data?.current?.type === "rule-item"
    ) {
      swapRules(event.active?.id as string, event.over?.id as string);
    }
  };
  return {
    onDrop: handleDrop,
  };
};
