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
import { SelectedComponent } from "@/src/App";
import { FieldErrors, FieldValues, useForm } from "react-hook-form";
import { useEffect, useState } from "react";

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
  } = useForm({
    mode: "onChange",
  });
  const [fieldRules, setFieldRules] = useState<Rule[]>([]);
  const [warningName, setWarningName] = useState("");
  const watchFormComponentName = watch("formComponentName");
  const [openDialog, setOpenDialog] = useState(false);

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
    console.log("test");
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

  return (
    <Dialog
      open={openDialog}
      onOpenChange={() => {
        setOpenDialog(!openDialog);
      }}
    >
      <DialogTrigger asChild>
        <a className="mr-2 border-2 border-solid rounded-sm">
          <Badge key={selectedComponent.id}>
            {selectedComponent.component.label ||
              selectedComponent.component.formComponentName ||
              selectedComponent.name}
            <X
              className="ml-1 h-4 w-4"
              onClick={(e) => {
                e.preventDefault();
                onRemoveComponent(selectedComponent.id);
              }}
            />
          </Badge>
        </a>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white">
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
                defaultValue={selectedComponent.component.formComponentName}
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
            <div className="flex flex-col gap-1 mb-2">
              <Label htmlFor="placeholder">Placeholder</Label>
              <Input
                id="placeholder"
                {...register("placeholder")}
                defaultValue={selectedComponent.component.placeholder}
              />
            </div>
            <div className="flex flex-col gap-1 mb-2">
              <RulesSelector
                fieldRules={fieldRules}
                onUpdateFieldRules={setFieldRules}
              />
            </div>
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
  );
};
