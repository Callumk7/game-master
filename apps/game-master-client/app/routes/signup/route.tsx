import type { ActionFunctionArgs } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { uuidv4 } from "callum-util";
import { db } from "db";
import { users } from "db/schema/users";
import { redirect } from "remix-typedjson";
import { z } from "zod";
import { zx } from "zodix";
import { Button } from "~/components/ui/button";
import { Card, CardHeader, CardTitle } from "~/components/ui/card";
import { JollyTextField } from "~/components/ui/textfield";
import { authCookie, commitSession, getSession } from "~/lib/auth.server";
import { hashPassword } from "./queries.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const result = await zx.parseFormSafe(request, {
    username: z.string(),
    email: z.string().email(),
    password: z.string(),
  });

  if (!result.success) {
    return { error: result.error };
  }

  const { username, password, email } = result.data;

  const passwordHash = await hashPassword(password);

  const newUser = await db
    .insert(users)
    .values({ id: `user_${uuidv4()}`, username, email, passwordHash })
    .returning({ userId: users.id, username: users.username, email: users.email });

  const session = await getSession(await authCookie.serialize(newUser[0]));

  return redirect("/", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
};

export default function SignUpRoute() {
  return (
    <div className="h-screen flex items-center justify-center">
      <Card className="mx-auto md:w-1/2">
        <CardHeader>
          <CardTitle>Signup for Game Master</CardTitle>
        </CardHeader>
        <Form className="p-6 space-y-4" method="POST">
          <JollyTextField name="email" label="Email" type="email" isRequired />
          <JollyTextField name="username" label="Username" type="text" isRequired />
          <JollyTextField name="password" label="Password" type="password" isRequired />
          <Button type="submit">Create Account</Button>
        </Form>
      </Card>
    </div>
  );
}
