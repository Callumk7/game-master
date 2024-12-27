import { Form, type FormProps } from "react-router";
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
        <div className="flex items-stretch gap-2 w-full">
          <JollyTextField
            name="firstName"
            label="First Name"
            defaultValue={user?.firstName ?? undefined}
            type="text"
            className={"flex-1"}
          />
          <JollyTextField
            name="lastName"
            label="Last Name"
            defaultValue={user?.lastName ?? undefined}
            type="text"
            className={"flex-1"}
          />
        </div>
        <JollyTextField
          name="username"
          label="Username"
          defaultValue={user?.username}
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
