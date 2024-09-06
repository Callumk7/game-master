import type { ActionFunctionArgs } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { uuidv4 } from "callum-util";
import { db } from "db";
import { users } from "db/schema/users";
import { redirect } from "remix-typedjson";
import { z } from "zod";
import { zx } from "zodix";
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
    <div className="bg-red-50 w-full">
      <div className="my-24 w-1/2 mx-auto p-5">
        <Form method="POST">
          <div className="flex flex-col gap-3">
            <input name="username" className="border border-black p-1" placeholder="username" />
            <input name="email" className="border border-black p-1" placeholder="email" />
            <input name="password" className="border border-black p-1" placeholder="password" />
            <button type="submit">Sign Up</button>
          </div>
        </Form>
      </div>
    </div>
  );
}
