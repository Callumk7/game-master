import {
  type ActionFunctionArgs,
  json,
  type LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { db } from "db";
import { users } from "db/schema/users";
import { eq, and, gt } from "drizzle-orm";
import { z } from "zod";
import { parseForm, parseParams } from "zodix";
import { Button } from "~/components/ui/button";
import { JollyTextField } from "~/components/ui/textfield";
import { hashPassword } from "~/services/password-hash.server";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { token } = parseParams(params, { token: z.string() });

  const user = await db.query.users.findFirst({
    where: and(eq(users.resetToken, token), gt(users.resetTokenExpiry, new Date())),
  });

  if (!user) {
    throw new Error("Invalid or expired reset token");
  }

  return json({ token });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { password, token } = await parseForm(request, {
    password: z.string(),
    token: z.string(),
  });

  const passwordHash = await hashPassword(password);
  await db
    .update(users)
    .set({ passwordHash, resetToken: null, resetTokenExpiry: null })
    .where(eq(users.resetToken, token));

  return redirect("/login");
};

export default function ResetPasswordToken() {
  const { token } = useLoaderData<typeof loader>();

  return (
    <Form method="POST">
      <input type="hidden" name="token" value={token} />
      <JollyTextField type="password" name="password" />
      <Button type="submit">Update Password</Button>
    </Form>
  );
}
