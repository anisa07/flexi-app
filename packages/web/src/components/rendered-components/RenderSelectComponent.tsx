import { RenderComponentType } from "@/src/types/RenderComponentType";
import { Controller } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";

export interface RenderSelectComponentType extends RenderComponentType {
  placeholder?: string;
  selectOptions?: { label: string; value: string }[];
}

export const RenderSelectComponent = ({
  control,
  componentName,
  error,
  label,
  placeholder,
  selectOptions = [],
}: RenderSelectComponentType) => {
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
            <Select
              //   id={componentName}
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {selectOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        )}
        name={componentName}
        control={control}
      />
    </>
  );
};
