import type { ActionFunctionArgs } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { uuidv4 } from "callum-util";
import { redirect } from "remix-typedjson";
import { z } from "zod";
import { parseFormSafe } from "zodix";
import { SERVER_URL } from "~/config";
import { authCookie, commitSession, getSession } from "~/lib/auth.server";

// NOTE: this is copied over from the node server on the backend.
export const newUserSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  username: z.string(),
  email: z.string().email(),
  passwordHash: z.string(),
});

export const action = async ({ request }: ActionFunctionArgs) => {
  const result = await parseFormSafe(request, {
    username: z.string(),
    email: z.string().email(),
    password: z.string(),
  });

  if (!result.success) {
    return { error: result.error };
  }

  const res = await fetch(`${SERVER_URL}/users`, {
    method: "POST",
    body: JSON.stringify(result.data),
  });

  const newUser = await res.json();

  const session = await getSession(await authCookie.serialize(newUser));

  return redirect("/", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
};

export default function SignUpRoute() {
  return (
    <div>
      <div className="my-24 w-1/2 mx-auto p-5">
        <Form method="POST">
          <input type="email" name="email" />
          <input type="password" name="password" />
          <input type="username" name="username" />
        </Form>
      </div>
    </div>
  );
}
