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
