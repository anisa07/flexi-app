import { Control, FieldPath } from "react-hook-form";

export interface RenderComponentType {
  type: string;
  componentName: string; // never?
  control: Control<{}, any>;
  label?: string;
  error?: boolean;
}
