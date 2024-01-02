import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/popover";
import { Button } from "@/src/components/ui/button";
import { Calendar } from "@/src/components/ui/calendar";
import { Controller } from "react-hook-form";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { RenderComponentType } from "@/src/types/RenderComponentType";

export interface RenderDatepickerComponentType extends RenderComponentType {
  placeholder?: string;
  format?: string;
}

export const RenderDatepickerComponent = ({
  control,
  componentName,
  error,
  label,
  placeholder,
  format: dateFormat,
}: RenderDatepickerComponentType) => {
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
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[240px] pl-3 text-left font-normal",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value ? (
                    format(field.value, dateFormat || "MM/dd/yyyy")
                  ) : (
                    <span>{placeholder || "Pick a date"}</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                />
              </PopoverContent>
            </Popover>
          </div>
        )}
        name={componentName}
        control={control}
      />
    </>
  );
};
