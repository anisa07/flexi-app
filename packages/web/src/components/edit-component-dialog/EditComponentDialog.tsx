import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/src/components/ui/dialog";
import { Rule, RulesSelector } from "../rule-selector/RuleSelector";
import {
  FieldErrors,
  FieldValues,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { useEffect, useState } from "react";
import { SelectedComponent } from "@/src/types/SelectedComponent";

interface EditComponentDialogProps {
  openDialog: boolean;
  fieldRules: Rule[];
  onCloseDialog: () => void;
  selectedComponent: SelectedComponent;
  setFieldRules: (fieldRules: Rule[]) => void;
  onUpdateComponent: (component: SelectedComponent) => void | string;
}

export const EditComponentDialog = ({
  fieldRules,
  openDialog,
  onCloseDialog,
  selectedComponent,
  onUpdateComponent,
  setFieldRules,
}: EditComponentDialogProps) => {
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
      formComponentName: selectedComponent?.component?.formComponentName || "",
      label: selectedComponent?.component?.label || "",
      format: selectedComponent?.component?.format || "",
      placeholder: selectedComponent?.component?.placeholder || "",
    },
  });

  const [warningName, setWarningName] = useState("");
  const watchFormComponentName = watch("formComponentName");

  const { fields, append, remove } = useFieldArray({
    control,
    name: "radiogroup",
  });

  useEffect(() => {
    if (warningName && warningName !== watchFormComponentName) {
      setWarningName("");
    }
  }, [watchFormComponentName, warningName]);

  const onErrors = (errors: FieldErrors) => console.error(errors);

  const handleUpdateComponent = (
    selectedComponent: SelectedComponent,
    data: FieldValues,
    fieldRules: Rule[]
  ) =>
    onUpdateComponent({
      ...selectedComponent,
      component: {
        ...selectedComponent.component,
        format: data.format,
        formComponentName: data.formComponentName,
        placeholder: data.placeholder,
        label: data.label,
        validation: fieldRules,
        radioGroupOptions: data.radiogroup,
      },
    });

  const handleSaveField = (data: FieldValues) => {
    const updateResult = handleUpdateComponent(
      selectedComponent,
      data,
      fieldRules
    );
    if (updateResult) {
      setWarningName(updateResult);
      return;
    }
    onCloseDialog();
  };

  const isComponentDynamicForm = () =>
    selectedComponent.component.type === "dynamicForm";

  const isDatepickerComponent = () =>
    selectedComponent.component.type === "datepicker";

  const isRadiogroupComponent = () =>
    selectedComponent.component.type === "radiogroup";

  return (
    <Dialog open={openDialog} onOpenChange={onCloseDialog}>
      <DialogContent className="sm:max-w-[425px] bg-white overflow-y-scroll max-h-screen">
        {selectedComponent ? (
          <>
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
                  <Input id="label" {...register("label")} />
                </div>
                {isDatepickerComponent() && (
                  <div className="flex flex-col gap-1 mb-2">
                    <Label htmlFor="date-format">
                      date-fns format (default is "MM/dd/yyyy")
                    </Label>
                    <Input id="date-format" {...register("format")} />
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
                      <div key={field.id} className="flex gap-1 mb-2 items-end">
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
                        <Button onClick={() => remove(index)}>Delete</Button>
                      </div>
                    ))}
                  </div>
                )}
                {!isComponentDynamicForm() && !isRadiogroupComponent() && (
                  <div className="flex flex-col gap-1 mb-2">
                    <Label htmlFor="placeholder">Placeholder</Label>
                    <Input id="placeholder" {...register("placeholder")} />
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
                <Button variant="outline" onClick={onCloseDialog}>
                  Cancel
                </Button>
                <Button type="submit" disabled={!isValid}>
                  Save changes
                </Button>
              </DialogFooter>
            </form>
          </>
        ) : (
          <>Waiting...</>
        )}
      </DialogContent>
    </Dialog>
  );
};
