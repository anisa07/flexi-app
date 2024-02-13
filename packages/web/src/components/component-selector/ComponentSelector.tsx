import { Option } from "../autocomplete/Autocomplete";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Badge } from "@/src/components/ui/badge";
import { Card } from "@/src/components/ui/card";

const components: Option[] = [
  {
    value: "input",
    label: "Input",
  },
  {
    value: "textarea",
    label: "TextArea",
  },
  {
    value: "password",
    label: "Password",
  },
  {
    value: "select",
    label: "Select",
  },
  {
    value: "checkbox",
    label: "Checkbox",
  },
  {
    value: "radiogroup",
    label: "RadioGroup",
  },
  {
    value: "togglebutton",
    label: "ToggleButton",
  },
  {
    value: "datepicker",
    label: "DatePicker",
  },
];

const allComponents: Option[] = [
  ...components,
  {
    label: "DynamicForm",
    value: "dynamicForm",
  },
];

interface ComponentSelector {
  dynamicComponent?: boolean;
}

export const ComponentSelector = ({ dynamicComponent }: ComponentSelector) => {
  return (
    <Card className="flex py-2 px-3 flex-wrap">
      {(dynamicComponent ? components : allComponents).map((component) => (
        <ComponentToSelect
          key={component.value}
          component={component}
          dynamicComponent={dynamicComponent}
        />
      ))}
    </Card>
  );
};

const ComponentToSelect = ({
  component,
  dynamicComponent,
}: {
  component: Option;
  dynamicComponent?: boolean;
}) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: dynamicComponent ? `dynamic-${component.value}` : component.value,
    data: {
      type: dynamicComponent
        ? `dynamic-selected-component`
        : `selected-component`,
      value: component,
    },
  });

  return (
    <div
      className="mr-1 mb-1 border-2 border-solid rounded-sm"
      style={{
        transform: CSS.Translate.toString(transform),
      }}
      {...listeners}
      {...attributes}
      ref={setNodeRef}
    >
      <Badge key={component.value}>{component.label}</Badge>
    </div>
  );
};
