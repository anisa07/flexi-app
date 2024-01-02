import { Controller } from "react-hook-form";
import { Checkbox } from "@/src/components/ui/checkbox";
import { Switch } from "@/src/components/ui/switch";
import { RenderComponentType } from "@/src/types/RenderComponentType";

export const RenderCheckComponent = ({
  control,
  componentName,
  label,
  type,
}: RenderComponentType) => {
  return (
    <Controller
      name={componentName}
      control={control}
      render={({ field }) => {
        return (
          <div className="items-top flex space-x-2">
            {type === "checkbox" && (
              <Checkbox
                id={componentName}
                {...field}
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
            {type === "togglebutton" && (
              <Switch
                id={componentName}
                {...field}
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
            <div className="grid gap-1.5 leading-none">
              {label && (
                <label
                  htmlFor={componentName}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {label}
                </label>
              )}
            </div>
          </div>
        );
      }}
    />
  );
};
