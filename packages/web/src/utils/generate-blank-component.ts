import { v4 as uuidv4 } from "uuid";
import { Option } from "@/src/components/autocomplete/Autocomplete";
import { SelectedComponent } from "../types/SelectedComponent";

export const generateBlankComponent = (option: Option): SelectedComponent => ({
  name: option.label,
  id: uuidv4(),
  component: {
    type: option.value,
    formComponentName: "",
    label: "",
    placeholder: "",
    validation: [],
    subComponents: [],
    selectOptions: [],
    format: "",
    radioGroupOptions: [],
  },
});
