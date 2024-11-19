import { json, type ActionFunctionArgs } from "@remix-run/node";
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
import { env } from "~/lib/env.server";
import { emailService } from "~/services/email.server";
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

  try {
    const verificationToken = crypto.randomUUID();
    const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
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
        emailVerified: false,
        emailVerificationToken: verificationToken,
        emailVerificationTokenExpiry: tokenExpiry,
      })
      .returning({ userId: users.id, username: users.username, email: users.email });

    const confirmationLink = `${env.APP_URL}/verify-email/${verificationToken}`;

    await emailService.sendConfirmationEmail(email, confirmationLink);

    const session = await getSession(await authCookie.serialize(newUser[0]));

    return redirect("/check-email", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  } catch (error) {
    return json({ error: "Failed to create account" }, { status: 400 });
  }
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
