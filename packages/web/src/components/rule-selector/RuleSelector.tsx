import { Autocomplete, Option } from "../autocomplete/Autocomplete";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { X, Check } from "lucide-react";
import { useRef, useState } from "react";
import { checkRuleParams } from "@/src/utils/check-rule-params";
import { Draggable } from "../draggable/Draggable";

const rules = [
  {
    value: "required",
    label: "Required",
  },
  {
    value: "email",
    label: "Email",
  },
  {
    value: "regex",
    label: "Regex",
  },
  {
    value: "ipaddress",
    label: "IpAddress",
  },
  {
    value: "minlength",
    label: "MinLength",
  },
  {
    value: "maxlength",
    label: "MaxLength",
  },
];

export interface Rule {
  ruleName: string;
  rule: string;
  withParam: boolean;
  param?: any;
}

export const RulesSelector = ({
  fieldRules,
  onUpdateFieldRules,
}: {
  fieldRules: Rule[];
  onUpdateFieldRules: (value: Rule[]) => void;
}) => {
  const [selectedRule, setSlectedRule] = useState<Rule | undefined>(undefined);
  const [errorMessage, seterrorMessage] = useState("");
  const paramRef = useRef<HTMLInputElement>(null);

  const handleSaveParam = () => {
    seterrorMessage("");
    if (!selectedRule) return;
    const param = checkRuleParams(selectedRule.ruleName);
    if (!param) return;
    const currentParam = paramRef.current?.value || "";
    if (currentParam.trim() === "") {
      seterrorMessage("Param cannot be empty");
      return;
    }
    let paramValue;

    if (param.type === RegExp) {
      paramValue = new RegExp(currentParam);
      if (paramValue instanceof RegExp === false) {
        seterrorMessage("Regex is invalid");
        return;
      }
    }

    if (param.type === "number") {
      paramValue = Number(currentParam);
      if (isNaN(paramValue)) {
        seterrorMessage("Not a number");
        return;
      }
    }

    onUpdateFieldRules([
      ...fieldRules,
      {
        ...selectedRule,
        param: paramValue,
        rule: `${selectedRule.ruleName}(${paramValue})`,
      },
    ]);
    setSlectedRule(undefined);
  };

  const fieldHasRule = (rule: Option) => {
    return fieldRules.find((r: Rule) => r.ruleName === rule.value);
  };

  const updateWithRule = (rule: Rule) => {
    onUpdateFieldRules([...fieldRules, rule]);
  };

  const handleSelectRule = (rule: Option) => {
    if (fieldHasRule(rule)) {
      setSlectedRule(undefined);
      return;
    }
    const withParam = checkRuleParams(rule.value);
    const validationRule = {
      ruleName: rule.value,
      rule: `${rule.value}()`,
      withParam: !!withParam,
    };
    if (!withParam) {
      updateWithRule(validationRule);
    }
    setSlectedRule(validationRule);
  };

  const onRemoveRule = (rule: string) => {
    onUpdateFieldRules(
      fieldRules.filter((item: Rule) => item.ruleName !== rule)
    );
  };

  const onMove = (currentIndex: number, nextIndex: number) => {
    const copyRules = [...fieldRules];
    const nextRuleCopy = { ...copyRules[nextIndex] };
    copyRules[nextIndex] = { ...copyRules[currentIndex] };
    copyRules[currentIndex] = nextRuleCopy;
    onUpdateFieldRules(copyRules);
  };

  return (
    <>
      <div>
        <Autocomplete
          label="Rule"
          emptyValue="No rule found"
          options={rules}
          placeholder="Select or search a rule"
          onSelectValue={(rule) => {
            handleSelectRule(rule);
          }}
        />
      </div>
      {selectedRule?.withParam && (
        <div className="flex flex-col gap-1">
          <Label htmlFor="with-params">Validation function param</Label>
          <div className="flex">
            <Input
              ref={paramRef}
              id="with-params"
              defaultValue={selectedRule.param || ""}
              className="flex-1 mr-1"
            />
            <Button onClick={handleSaveParam}>
              <Check />
            </Button>
          </div>
          {!!errorMessage && <p className="text-red-700">{errorMessage}</p>}
        </div>
      )}
      {fieldRules.length > 0 && (
        <div className="flex border p-2 flex-wrap">
          {fieldRules.map((validationRule: Rule, index: number) => (
            <RuleItem
              key={validationRule.ruleName}
              validationRule={validationRule}
              index={index}
              onRemoveRule={onRemoveRule}
              onMove={onMove}
            />
          ))}
        </div>
      )}
    </>
  );
};

const RuleItem = ({
  validationRule,
  onRemoveRule,
  onMove,
  index,
}: {
  validationRule: Rule;
  onRemoveRule: (name: string) => void;
  onMove: (currentIndex: number, nextIndex: number) => void;
  index: number;
}) => {
  const handleRemoveRule = () => {
    onRemoveRule(validationRule.ruleName);
  };

  return (
    <Draggable onMove={onMove} index={index} id={validationRule.ruleName}>
      <div className="mr-1 mb-1  border-2 border-solid rounded-sm">
        <Badge key={validationRule.ruleName}>
          {validationRule.rule}
          <X
            className="ml-1 h-4 w-4"
            onClick={(e) => {
              e.preventDefault();
              handleRemoveRule();
            }}
          />
        </Badge>
      </div>
    </Draggable>
  );
};
