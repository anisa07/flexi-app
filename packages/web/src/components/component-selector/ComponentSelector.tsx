import { Autocomplete, Option } from "../autocomplete/Autocomplete";

const components = [
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

interface ComponentSelectorProps {
  onSelectComponents: (value: Option) => void;
}

export const ComponentSelector = ({
  onSelectComponents,
}: ComponentSelectorProps) => {
  const handleSelectComponent = (value: Option) => {
    onSelectComponents(value);
  };

  return (
    <>
      <Autocomplete
        label="Component"
        emptyValue="No component found"
        options={components}
        placeholder="Select or search a component"
        onSelectValue={handleSelectComponent}
      />
    </>
  );
};
