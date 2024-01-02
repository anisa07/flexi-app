export const detectRenderComponent = (type: string) => {
  if (["input", "password", "textarea"].includes(type)) {
    return "renderInput";
  }
  if (type === "checkbox" || type === "togglebutton") {
    return "renderCheck";
  }
  if (type === "select") {
    return "renderSelect";
  }
  if (type === "radiogroup") {
    return "renderRadiogroup";
  }
  if (type === "datepicker") {
    return "renderDatepicker";
  }
};
