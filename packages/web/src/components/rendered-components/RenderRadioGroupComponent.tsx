import { RenderComponentType } from "@/src/types/RenderComponentType";
import { RadioGroup, RadioGroupItem } from "@/src/components/ui/radio-group";
import { Controller } from "react-hook-form";

export interface RenderRadioGroupComponentType extends RenderComponentType {
  radioGroupOptions?: { label: string; value: string }[];
}

export const RenderRadioGroupComponent = ({
  control,
  componentName,
  error,
  label,
  radioGroupOptions = [],
}: RenderRadioGroupComponentType) => {
  return (
    <>
      {label && (
        <label htmlFor={componentName} className={`${error && "text-red-700"}`}>
          {label}
        </label>
      )}
      <Controller
        render={({ field }) => (
          <div className="mb-1">
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className="flex flex-col space-y-1"
            >
              {radioGroupOptions.map((item, index) => (
                <div
                  className="flex items-center space-x-3 space-y-0"
                  key={index}
                >
                  <RadioGroupItem value={item.value} id={`${index}`} />
                  <label htmlFor={index}>{item.label}</label>
                </div>
              ))}
            </RadioGroup>
          </div>
        )}
        name={componentName}
        control={control}
      />
    </>
  );
};
