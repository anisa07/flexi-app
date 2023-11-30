const rulesMap = new Map<string, undefined | { type: any }>();
rulesMap.set("regex", { type: RegExp });
rulesMap.set("minLength", { type: "number" });
rulesMap.set("maxlength", { type: "number" });

export const checkRuleParams = (rule: string) => {
  return rulesMap.get(rule) || false;
};
