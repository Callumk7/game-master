import type { ActionFunctionArgs } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { redirect } from "remix-typedjson";
import { z } from "zod";
import { parseFormSafe } from "zodix";
import { SERVER_URL } from "~/config";
import { authCookie, commitSession, getSession } from "~/lib/auth.server";

const newUserSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  username: z.string(),
  email: z.string().email(),
  password: z.string(),
});

export const action = async ({ request }: ActionFunctionArgs) => {
  const result = await parseFormSafe(request, newUserSchema);

  if (!result.success) {
    return { error: result.error };
  }

  const newUserRequestData = {
    username: result.data.username,
    passwordHash: result.data.password,
    email: result.data.email
  }

  const res = await fetch(`${SERVER_URL}/users`, {
    method: "POST",
    body: JSON.stringify(newUserRequestData),
  });

  const newUser = await res.json();
  console.log(JSON.stringify(newUser))

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
        <Form method="POST" className="flex flex-col gap-2">
        <label htmlFor="email">Email</label>
          <input type="email" name="email" className="border border-black p-1" />
        <label htmlFor="password">Password</label>
          <input type="password" name="password" className="border border-black p-1" />
          <label htmlFor="username">Username</label>
          <input type="username" name="username" className="border border-black p-1" />
        <button type="submit" className="bg-red-600">Submit</button>
        </Form>
      </div>
    </div>
  );
}
