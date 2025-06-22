import { Form, type FormProps } from "@remix-run/react";
import type { User } from "@repo/api";
import { cn } from "callum-util";
import { Button } from "../ui/button";
import { JollyTextField } from "../ui/textfield";

interface BaseUserFormProps<T extends User> extends FormProps {
  user?: T;
  buttonLabel: string;
}
export function BaseUserForm<T extends User>({
  user,
  buttonLabel,
  className,
  children,
  ...props
}: BaseUserFormProps<T>) {
  return (
    <Form {...props}>
      <div className={cn(className, "p-6 flex flex-col gap-2")}>
        <JollyTextField
          name="email"
          label="Email"
          defaultValue={user?.email}
          type="email"
          isRequired
        />
        <JollyTextField
          name="username"
          label="Username"
          defaultValue={user?.name}
          type="text"
          isRequired
        />
        {children}
        {user?.id && <input type="hidden" value={user.id} name="userId" />}
        <Button type="submit">{buttonLabel}</Button>
      </div>
    </Form>
  );
}
