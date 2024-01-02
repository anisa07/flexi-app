import { Badge } from "@/src/components/ui/badge";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/src/components/ui/dialog";
import { X } from "lucide-react";
import { Rule, RulesSelector } from "../rule-selector/RuleSelector";
import {
  FieldErrors,
  FieldValues,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { useEffect, useState } from "react";
import { ComponentSelector } from "../component-selector/ComponentSelector";
import { Option } from "@/src/components/autocomplete/Autocomplete";
import { ComponentDashboard } from "../component-dashboard/ComponentDashboard";
import { SelectedComponent } from "@/src/types/SelectedComponent";
import { generateBlankComponent } from "@/src/utils/generate-blank-component";

export interface DashboardItemProps {
  selectedComponent: SelectedComponent;
  onRemoveComponent: (id: string) => void;
  onUpdateComponent: (
    component: SelectedComponent,
    data: FieldValues,
    fieldsRules: Rule[]
  ) => void | string;
}

export const DashboardItem = ({
  selectedComponent,
  onUpdateComponent,
  onRemoveComponent,
}: DashboardItemProps) => {
  const {
    register,
    handleSubmit,
    formState: { isValid, errors },
    watch,
    control,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      radiogroup: [{ label: "", value: "" }],
      formComponentName: "",
      label: "",
      format: "",
      placeholder: "",
    },
  });
  const [fieldRules, setFieldRules] = useState<Rule[]>([]);
  const [warningName, setWarningName] = useState("");
  const watchFormComponentName = watch("formComponentName");
  const [openDialog, setOpenDialog] = useState(false);
  const [dynamicComponents, setDynamicComponents] = useState<
    SelectedComponent[]
  >([]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "radiogroup",
  });

  const handleAddDynamicComponent = (option: Option) => {
    setDynamicComponents([
      ...dynamicComponents,
      generateBlankComponent(option),
    ]);
  };

  const handleRemoveDynamicComponent = (id: string) => {
    onUpdateComponent(
      {
        ...selectedComponent,
        component: {
          ...selectedComponent.component,
          subComponents: dynamicComponents.filter((c) => c.id !== id),
        },
      },
      {
        formComponentName:
          selectedComponent.component.formComponentName || "dynamicFormName",
      },
      []
    );
    setDynamicComponents(dynamicComponents.filter((c) => c.id !== id));
  };

  const handleUpdateDynamicComponent = (component: SelectedComponent) => {
    const findIndex = dynamicComponents.findIndex((c) => c.id === component.id);
    if (findIndex !== -1) {
      const copyDynamicComponents = [...dynamicComponents];
      copyDynamicComponents[findIndex] = component;
      onUpdateComponent(
        {
          ...selectedComponent,
          component: {
            ...selectedComponent.component,
            subComponents: copyDynamicComponents,
          },
        },
        {
          formComponentName:
            selectedComponent.component.formComponentName || "dynamicFormName",
        },
        []
      );
      setDynamicComponents(copyDynamicComponents);
    }
  };

  useEffect(() => {
    if (warningName && warningName !== watchFormComponentName) {
      setWarningName("");
    }
  }, [watchFormComponentName, warningName]);

  const onErrors = (errors: FieldErrors) => console.error(errors);

  const handleSaveField = (
    // selectedComponent,
    data: FieldValues
    // fieldRules
  ) => {
    const updateResult = onUpdateComponent(selectedComponent, data, fieldRules);
    if (updateResult) {
      setWarningName(updateResult);
      return;
    }
    handleCloseDialog();
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const isComponentDynamicForm = () =>
    selectedComponent.component.type === "dynamicForm";

  const isDatepickerComponent = () =>
    selectedComponent.component.type === "datepicker";

  const isRadiogroupComponent = () =>
    selectedComponent.component.type === "radiogroup";

  return (
    <div
      className={`mr-2 mb-2 p-1 border-2 border-solid rounded-sm inline-block ${
        isComponentDynamicForm() ? "bg-slate-200" : "inherit"
      }`}
    >
      <Badge key={selectedComponent.id}>
        <div className="flex">
          <div className="flex flex-col">
            <Dialog
              open={openDialog}
              onOpenChange={() => {
                setOpenDialog(!openDialog);
              }}
            >
              <DialogTrigger asChild>
                <p className="text-sm">
                  {selectedComponent.component.label ||
                    selectedComponent.component.formComponentName ||
                    selectedComponent.name}
                </p>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] bg-white overflow-y-scroll max-h-screen">
                <DialogHeader>
                  <DialogTitle>Component parameters</DialogTitle>
                  <DialogDescription>
                    {`Set the parameters for the ${selectedComponent.component.type} component`}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(handleSaveField, onErrors)}>
                  <div className="grid gap-4 py-4">
                    <div className="flex flex-col gap-1 mb-2">
                      <Label htmlFor="formComponentName" className="mb-1">
                        Form field name *
                      </Label>
                      <Input
                        id="formComponentName"
                        required
                        {...register("formComponentName", { required: true })}
                        defaultValue={
                          selectedComponent.component.formComponentName
                        }
                      />
                      {errors.formComponentName &&
                        errors.formComponentName.type === "required" && (
                          <span role="alert" className="text-red-600 text-sm">
                            Form name is required
                          </span>
                        )}
                    </div>
                    <div className="flex flex-col gap-1 mb-2">
                      <Label htmlFor="label">Label</Label>
                      <Input
                        id="label"
                        {...register("label")}
                        defaultValue={selectedComponent.component.label}
                      />
                    </div>
                    {isDatepickerComponent() && (
                      <div className="flex flex-col gap-1 mb-2">
                        <Label htmlFor="date-format">
                          date-fns format (default is "MM/dd/yyyy")
                        </Label>
                        <Input
                          id="date-format"
                          {...register("format")}
                          defaultValue={selectedComponent.component.format}
                        />
                      </div>
                    )}
                    {isRadiogroupComponent() && (
                      <div className="flex flex-col gap-1 mb-2">
                        <Button
                          onClick={(e) => {
                            e.preventDefault();
                            append({ value: "", label: "" });
                          }}
                        >
                          Add radio option
                        </Button>
                        {fields.map((field, index) => (
                          <div
                            key={field.id}
                            className="flex gap-1 mb-2 items-end"
                          >
                            <div>
                              <Label htmlFor={`${field.id}-label`}>Label</Label>
                              <Input
                                key={`${field.id}-label`}
                                {...register(`radiogroup.${index}.label`)}
                              />
                            </div>
                            <div>
                              <Label htmlFor={`${field.id}-value`}>Value</Label>
                              <Input
                                key={`${field.id}-value`}
                                {...register(`radiogroup.${index}.value`)}
                              />
                            </div>
                            <Button onClick={() => remove(index)}>
                              Delete
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                    {!isComponentDynamicForm() && !isRadiogroupComponent() && (
                      <div className="flex flex-col gap-1 mb-2">
                        <Label htmlFor="placeholder">Placeholder</Label>
                        <Input
                          id="placeholder"
                          {...register("placeholder")}
                          defaultValue={selectedComponent.component.placeholder}
                        />
                      </div>
                    )}
                    {!isComponentDynamicForm() && (
                      <div className="flex flex-col gap-1 mb-2">
                        <RulesSelector
                          fieldRules={fieldRules}
                          onUpdateFieldRules={setFieldRules}
                        />
                      </div>
                    )}
                    {warningName && (
                      <span className="text-red-600 text-sm">{`Component with name  ${warningName} already exists. Please change it`}</span>
                    )}
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={handleCloseDialog}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={!isValid}>
                      Save changes
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            {isComponentDynamicForm() && (
              <>
                <div className="mb-2">
                  <ComponentSelector
                    onSelectComponents={handleAddDynamicComponent}
                  />
                </div>
                <ComponentDashboard
                  selectedComponents={dynamicComponents}
                  onRemoveComponent={handleRemoveDynamicComponent}
                  onUpdateComponent={handleUpdateDynamicComponent}
                />
              </>
            )}
          </div>
          <X
            className="ml-1 h-4 w-4"
            onClick={(e) => {
              e.preventDefault();
              onRemoveComponent(selectedComponent.id);
            }}
          />
        </div>
      </Badge>
    </div>
  );
};
