import { CheckIcon, MinusIcon } from "@radix-ui/react-icons";
import {
  Checkbox as AriaCheckbox,
  CheckboxGroup as AriaCheckboxGroup,
  type CheckboxGroupProps as AriaCheckboxGroupProps,
  type CheckboxProps as AriaCheckboxProps,
  type ValidationResult as AriaValidationResult,
  Text,
  composeRenderProps,
} from "react-aria-components";

import { cn } from "callum-util";
import { FieldError, Label, labelVariants } from "./field";

const CheckboxGroup = AriaCheckboxGroup;

const Checkbox = ({ className, children, ...props }: AriaCheckboxProps) => (
  <AriaCheckbox
    className={composeRenderProps(className, (className) =>
      cn(
        "group flex items-center gap-x-2",
        /* Disabled */
        "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-70",
        labelVariants,
        className,
      ),
    )}
    {...props}
  >
    {composeRenderProps(children, (children, renderProps) => (
      <>
        <div
          className={cn(
            "flex size-4 shrink-0 items-center justify-center rounded-sm border border-primary text-current shadow",
            /* Focus Visible */
            "group-data-[focus-visible]:outline-none group-data-[focus-visible]:ring-1 group-data-[focus-visible]:ring-ring",
            /* Selected */
            "group-data-[indeterminate]:bg-primary group-data-[selected]:bg-primary group-data-[indeterminate]:text-primary-foreground  group-data-[selected]:text-primary-foreground",
            /* Disabled */
            "group-data-[disabled]:cursor-not-allowed group-data-[disabled]:opacity-50",
            /* Invalid */
            "group-data-[invalid]:border-destructive group-data-[invalid]:group-data-[selected]:bg-destructive group-data-[invalid]:group-data-[selected]:text-destructive-foreground",
            /* Resets */
            "focus-visible:outline-none",
          )}
        >
          {renderProps.isIndeterminate ? (
            <MinusIcon className="size-4" />
          ) : renderProps.isSelected ? (
            <CheckIcon className="size-4" />
          ) : null}
        </div>
        {children}
      </>
    ))}
  </AriaCheckbox>
);

interface JollyCheckboxGroupProps extends AriaCheckboxGroupProps {
  label?: string;
  description?: string;
  errorMessage?: string | ((validation: AriaValidationResult) => string);
}

function JollyCheckboxGroup({
  label,
  description,
  errorMessage,
  className,
  children,
  ...props
}: JollyCheckboxGroupProps) {
  return (
    <CheckboxGroup
      className={composeRenderProps(className, (className) =>
        cn("group flex flex-col gap-2", className),
      )}
      {...props}
    >
      {composeRenderProps(children, (children) => (
        <>
          <Label>{label}</Label>
          {children}
          {description && (
            <Text className="text-sm text-muted-foreground" slot="description">
              {description}
            </Text>
          )}
          <FieldError>{errorMessage}</FieldError>
        </>
      ))}
    </CheckboxGroup>
  );
}

export { Checkbox, CheckboxGroup, JollyCheckboxGroup };
export type { JollyCheckboxGroupProps };
