import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { RenderComponentType } from "@/src/types/RenderComponentType";
import { Controller } from "react-hook-form";

export interface RenderInputType extends RenderComponentType {
  placeholder?: string;
}

export const RenderInputComponent = ({
  type,
  componentName,
  control,
  error,
  label,
  ...rest
}: RenderInputType) => {
  return (
    <>
      {label && (
        <label htmlFor={componentName} className={`${error && "text-red-700"}`}>
          {label}
        </label>
      )}
      <Controller
        name={componentName}
        render={({ field }) => (
          <div className="mb-1">
            {type === "textarea" && (
              <Textarea id={componentName} {...rest} {...field} />
            )}
            {(type === "input" || type === "password") && (
              <Input id={componentName} type={type} {...rest} {...field} />
            )}
          </div>
        )}
        control={control}
      />
    </>
  );
};
