import { type ActionFunctionArgs, data, redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { baseUserSchema } from "@repo/api";
import { AlligatorServer } from "alligator-auth";
import { uuidv4 } from "callum-util";
import { db } from "db";
import { users } from "db/schema/users";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { zx } from "zodix";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Link } from "~/components/ui/link";
import { JollyTextField } from "~/components/ui/textfield";
import { env } from "~/lib/env.server";
import { emailService } from "~/services/email.server";

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

    const newUser = await db
      .insert(users)
      .values({
        id: `user_${uuidv4()}`,
        username,
        email,
        firstName,
        lastName,
        emailVerified: false,
        emailVerificationToken: verificationToken,
        emailVerificationTokenExpiry: tokenExpiry,
      })
      .returning({ userId: users.id });

    // create a user with the authentication server
    const client = new AlligatorServer(1);
    const response = await client.register({ email, password }, newUser[0].userId);

    if (!response.ok) {
      console.log(await response.json());
      return data(
        { error: "failed to create account - auth server error" },
        { status: 400 },
      );
    }

    const authId = (await response.json().then((result) => result.user_id)) as string;
    await db
      .update(users)
      .set({ authId: Number(authId) })
      .where(eq(users.id, newUser[0].userId));

    const confirmationLink = `${env.APP_URL}/verify-email/${verificationToken}`;

    await emailService.sendConfirmationEmail(email, confirmationLink);

    return redirect("/check-email", {
      headers: response.headers,
    });
  } catch (error) {
    return data({ error: "Failed to create account" }, { status: 400 });
  }
};

export default function SignUpRoute() {
  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="mx-auto md:w-1/2">
        <CardHeader>
          <CardTitle>Signup for Game Master</CardTitle>
        </CardHeader>
        <CardContent>
          <Form method="POST" className="space-y-3">
            <JollyTextField name="username" label="Username" type="text" isRequired />
            <div className="space-x-1 flex">
              <JollyTextField
                name="firstName"
                label="First Name"
                type="text"
                isRequired
              />
              <JollyTextField name="lastName" label="Last Name" type="text" isRequired />
            </div>
            <JollyTextField name="email" label="Email" type="text" isRequired />
            <JollyTextField name="password" label="Password" type="password" isRequired />
            <div className="flex flex-col space-y-2">
              <Button type="submit">Sign Up</Button>
              <Link variant={"secondary"} href="/login">
                Already have an account? Sign in
              </Link>
            </div>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
