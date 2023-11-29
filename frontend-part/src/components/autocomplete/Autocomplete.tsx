"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "@/src/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/src/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/popover";
import { Label } from "@/src/components/ui/label";

export interface Option {
  value: string;
  label: string;
}

interface AutocompleteProps {
  label: string;
  options: Option[];
  onSelectValue: (value: Option) => void;
  placeholder: string;
  emptyValue: string;
}

export function Autocomplete({
  label,
  options,
  onSelectValue,
  emptyValue,
  placeholder,
}: AutocompleteProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const id = (label || "").toLowerCase().replace(/\s/g, "-");

  return (
    <div className="flex flex-col">
      <Label htmlFor={id} className="mb-1">
        {label}
      </Label>
      <Popover id={id} open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[230px] justify-between"
          >
            {value
              ? options.find((option) => option.value === value)?.label
              : placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[230px] p-0">
          <Command>
            <CommandInput placeholder={placeholder} />
            <CommandEmpty>{emptyValue}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={(currentValue: string) => {
                    setValue(currentValue === value ? "" : currentValue);
                    onSelectValue(option);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
