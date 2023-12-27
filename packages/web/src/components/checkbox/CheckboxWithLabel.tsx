"use client";
import { Checkbox } from "@/src/components/ui/checkbox";

export function CheckboxWithhLabel({
  label,
  checked,
  onCheck,
}: {
  label: string;
  checked: boolean;
  onCheck: (v: boolean) => void;
}) {
  const id = (label || "").toLowerCase().replace(/\s/g, "-");
  return (
    <div className="flex items-center space-x-2">
      <Checkbox id={id} checked={checked} onCheckedChange={onCheck} />
      <label
        htmlFor={id}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {label}
      </label>
    </div>
  );
}
