import type { ActionFunctionArgs } from "@remix-run/node";
import { baseUserSchema } from "@repo/api";
import { uuidv4 } from "callum-util";
import { db } from "db";
import { users } from "db/schema/users";
import { redirect } from "remix-typedjson";
import { z } from "zod";
import { zx } from "zodix";
import { BaseUserForm } from "~/components/forms/user-forms";
import { Card, CardHeader, CardTitle } from "~/components/ui/card";
import { JollyTextField } from "~/components/ui/textfield";
import { authCookie, commitSession, getSession } from "~/lib/auth.server";
import { hashPassword } from "~/services/password-hash.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const result = await zx.parseFormSafe(
    request,
    baseUserSchema.extend({
      password: z.string(),
    }),
  );

  if (!result.success) {
    return { error: result.error };
  }

  const { username, password, email, firstName, lastName } = result.data;

  const passwordHash = await hashPassword(password);

  const newUser = await db
    .insert(users)
    .values({
      id: `user_${uuidv4()}`,
      username,
      email,
      passwordHash,
      firstName,
      lastName,
    })
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
    <div className="flex justify-center items-center h-screen">
      <Card className="mx-auto md:w-1/2">
        <CardHeader>
          <CardTitle>Signup for Game Master</CardTitle>
        </CardHeader>
        <BaseUserForm method="POST" buttonLabel="Create Account">
          <JollyTextField name="password" label="Password" type="password" isRequired />
        </BaseUserForm>
      </Card>
    </div>
  );
}
