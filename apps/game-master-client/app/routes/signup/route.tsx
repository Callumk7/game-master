import { type ActionFunctionArgs, data, redirect } from "@remix-run/node";
import { useNavigate } from "@remix-run/react";
import { baseUserSchema } from "@repo/api";
import { useAlligator } from "alligator-auth";
import { uuidv4 } from "callum-util";
import { db } from "db";
import { type FormEvent, useState } from "react";
import { BaseUserForm } from "~/components/forms/user-forms";
import { Button } from "~/components/ui/button";
import { Card, CardHeader, CardTitle } from "~/components/ui/card";
import { Link } from "~/components/ui/link";
import { JollyTextField } from "~/components/ui/textfield";
import handleRequest from "~/entry.server";

//export const action = async ({ request }: ActionFunctionArgs) => {
//  const result = await zx.parseFormSafe(
//    request,
//    baseUserSchema.extend({
//      password: z.string(),
//    }),
//  );
//
//  if (!result.success) {
//    return { error: result.error };
//  }
//
//  try {
//    const verificationToken = crypto.randomUUID();
//    const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
//    const { username, password, email, firstName, lastName } = result.data;
//    const passwordHash = await hashPassword(password);
//
//
//    const newUser = await db
//      .insert(users)
//      .values({
//        id: `user_${uuidv4()}`,
//        username,
//        email,
//        passwordHash,
//        firstName,
//        lastName,
//        emailVerified: false,
//        emailVerificationToken: verificationToken,
//        emailVerificationTokenExpiry: tokenExpiry,
//      })
//      .returning({ userId: users.id, username: users.username, email: users.email });
//
//    const confirmationLink = `${env.APP_URL}/verify-email/${verificationToken}`;
//
//    await emailService.sendConfirmationEmail(email, confirmationLink);
//
//    const session = await getSession(await authCookie.serialize(newUser[0]));
//
//    return redirect("/check-email", {
//      headers: {
//        "Set-Cookie": await commitSession(session),
//      },
//    });
//  } catch (error) {
//    return data({ error: "Failed to create account" }, { status: 400 });
//  }
//};

export default function SignUpRoute() {
  const auth = useAlligator();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const success = await auth.register(email, password);

    if (success) {
      navigate("/");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="mx-auto md:w-1/2">
        <CardHeader>
          <CardTitle>Signup for Game Master</CardTitle>
        </CardHeader>
        <form onSubmit={handleRegister}>
          <JollyTextField
            name="email"
            label="Email"
            type="text"
            isRequired
            value={email}
            onInput={(e) => setEmail(e.currentTarget.value)}
          />
          <JollyTextField
            name="password"
            label="Password"
            type="password"
            isRequired
            value={password}
            onInput={(e) => setPassword(e.currentTarget.value)}
          />
          <Link variant={"secondary"} href="/login">
            Already have an account? Sign in
          </Link>
          <Button type="submit">Sign Up</Button>
        </form>
      </Card>
    </div>
  );
}
