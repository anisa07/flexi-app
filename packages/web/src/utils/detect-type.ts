export const detectType = (type: string, attrs: string) => {
  if (type === "textarea") {
    return `<textarea ${attrs} />`;
  }

  return `<input type="text" ${attrs} />`;
};
