import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Form, json, redirect, useLoaderData } from "@remix-run/react";
import { db } from "db";
import { users } from "db/schema/users";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { parseFormSafe } from "zodix";
import { Button } from "~/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { JollyTextField } from "~/components/ui/textfield";
import { commitSession, getUserSession } from "~/lib/auth.server";
import { verifyPassword } from "./queries.server";
import { Link } from "~/components/ui/link";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await getUserSession(request);
  // user is already logged in.
  if (session.get("userId")) {
    return redirect("/");
  }

  const data = { error: session.get("error") };
  return json(data, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const session = await getUserSession(request);
  const result = await parseFormSafe(request, {
    username: z.string(),
    password: z.string(),
  });

  if (!result.success) {
    return { error: result.error };
  }

  const { password, username } = result.data;

  const existingUser = await db.query.users.findFirst({
    where: eq(users.username, username),
  });

  if (!existingUser) {
    session.flash("error", "User does not exist");

    // Redirect back to the login page with errors.
    return redirect("/login", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  }

  const validPassword = await verifyPassword(existingUser.passwordHash, password);

  if (!validPassword) {
    session.flash("error", "Incorrect username or password");

    // Redirect back to the login page with errors.
    return redirect("/login", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  }

  session.set("userId", existingUser.id);

  return redirect("/", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
};

export default function LoginRoute() {
  const { error } = useLoaderData<typeof loader>();
  return (
    <div className="h-screen flex items-center justify-center">
      <Card className="mx-auto md:w-1/2">
        <CardHeader>
          <CardTitle>Welcome back!</CardTitle>
          <CardDescription className="text-destructive">{error}</CardDescription>
        </CardHeader>
        <Form className="p-6 space-y-4" method="POST">
          <JollyTextField name="username" label="Username" type="text" isRequired />
          <JollyTextField name="password" label="Password" type="password" isRequired />
          <div className="flex flex-col gap-2">
            <Button type="submit">Login</Button>
            <Link variant={"secondary"} href={"/signup"}>
              Need an account? Sign up
            </Link>
          </div>
        </Form>
      </Card>
    </div>
  );
}
