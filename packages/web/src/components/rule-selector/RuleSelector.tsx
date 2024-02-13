import { Autocomplete, Option } from "../autocomplete/Autocomplete";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { X, Check } from "lucide-react";
import { ReactElement, useRef, useState } from "react";
import { checkRuleParams } from "@/src/utils/check-rule-params";
// import { Draggable } from "../draggable/Draggable";
// import { useDroppable } from "@dnd-kit/core";
import {
  // arrayMove,
  SortableContext,
  // sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useDargAndDrop } from "../drag-and-drop/useDragAndDrop";

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
        <SortableContext
          items={fieldRules.map((rule) => ({ id: rule.ruleName, ...rule }))}
          strategy={verticalListSortingStrategy}
        >
          <div className="flex border p-2 flex-wrap">
            {fieldRules.map((validationRule: Rule) => (
              <SortableRule
                key={validationRule.ruleName}
                id={validationRule.ruleName}
              >
                <RuleItem
                  key={validationRule.ruleName}
                  validationRule={validationRule}
                  // index={index}
                  onRemoveRule={onRemoveRule}
                  // onMove={onMove}
                />
              </SortableRule>
            ))}
          </div>
        </SortableContext>
      )}
    </>
  );
};

const RuleItem = ({
  validationRule,
  onRemoveRule,
}: {
  validationRule: Rule;
  onRemoveRule: (name: string) => void;
}) => {
  const handleRemoveRule = () => {
    onRemoveRule(validationRule.ruleName);
  };

  return (
    <div className="mr-1 mb-1 border-2 border-solid rounded-sm">
      <Badge>
        {validationRule.rule}
        <X
          className="ml-1 h-4 w-4"
          onMouseDown={(e) => {
            e.preventDefault();
            handleRemoveRule();
          }}
        />
      </Badge>
    </div>
  );
};

function SortableRule({
  id,
  children,
}: {
  id: string;
  children: ReactElement;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id,
      data: {
        type: "rule-item",
      },
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    display: "inline-block",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
}
