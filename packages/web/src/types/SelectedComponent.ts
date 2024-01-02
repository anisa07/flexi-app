export type SelectedComponent = {
  name: string;
  id: string;
  component: {
    type: string;
    formComponentName: string;
    label: string;
    placeholder: string;
    validation: Array<{
      ruleName: string;
      withParam: boolean;
      param?: any;
    }>;
    subComponents: SelectedComponent[];
    selectOptions: { label: string; value: string }[];
    format: string;
    radioGroupOptions: { label: string; value: string }[];
  };
};
