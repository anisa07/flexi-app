import { Badge } from "@/src/components/ui/badge";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Button } from "@/src/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/popover";
import { X } from "lucide-react";
import { Rule, RulesSelector } from "../rule-selector/RuleSelector";
import { SelectedComponent } from "@/src/App";
import { FieldValues, useForm } from "react-hook-form";
import { useState } from "react";

export interface DashboardItemProps {
  selectedComponent: SelectedComponent;
  onRemoveComponent: (id: string) => void;
  onUpdateComponent: (component: SelectedComponent) => void;
}

export const DashboardItem = ({
  selectedComponent,
  onUpdateComponent,
  onRemoveComponent,
}: DashboardItemProps) => {
  const {
    register,
    handleSubmit,
    formState: { isValid },
  } = useForm();
  const [fieldRules, setFieldRules] = useState<Rule[]>([]);

  const onErrors = (errors) => console.error(errors);

  const handleSaveField = (
    selectedComponent,
    data: FieldValues,
    fieldRules
  ) => {
    onUpdateComponent(selectedComponent, data, fieldRules);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <a>
          <Badge className="mr-2" key={selectedComponent.id}>
            {selectedComponent.name}
            <X
              className="ml-1 h-4 w-4"
              onClick={(e) => {
                e.preventDefault();
                onRemoveComponent(selectedComponent.id);
              }}
            />
          </Badge>
        </a>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Component parameters</h4>
            <p className="text-sm text-muted-foreground">
              {`Set the parameters for the ${selectedComponent.component.type} component`}
            </p>
          </div>
          <div className="grid gap-2">
            <form onSubmit={handleSubmit(handleSaveField, onErrors)}>
              <div className="flex flex-col gap-1 mb-2">
                <Label required htmlFor="name">
                  Name
                </Label>
                <Input
                  id="name"
                  required
                  {...register("name", { required: true })}
                  defaultValue={selectedComponent.component.name}
                />
              </div>
              <div className="flex flex-col gap-1 mb-2">
                <Label htmlFor="width">Label</Label>
                <Input
                  {...register("label")}
                  defaultValue={selectedComponent.component.label}
                />
              </div>
              <div className="flex flex-col gap-1 mb-2">
                <Label htmlFor="maxWidth">Placeholder</Label>
                <Input
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
              <Button type="submit" disabled={!isValid}>
                Generate field
              </Button>
            </form>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
