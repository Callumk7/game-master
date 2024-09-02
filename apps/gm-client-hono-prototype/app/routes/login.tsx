import { eq } from "drizzle-orm";
import { verify } from "@node-rs/argon2";
import { type ActionFunctionArgs, redirect } from "@remix-run/node";
import { db } from "~/db/index";
import { users } from "~/db/schema/users";
import { lucia } from "~/server/auth.server";

export const action = async ({ request, params, context }: ActionFunctionArgs) => {
	const form = await request.formData();
	const email = form.get("email")?.toString();
	const password = form.get("password")?.toString();
	const results = await db.select().from(users).where(eq(users.email, email!));
	const existingUser = results[0];

	const validPassword = await verify(existingUser.passwordHash, password!, {
		memoryCost: 19456,
		timeCost: 2,
		outputLen: 32,
		parallelism: 1,
	});

	const session = await lucia.createSession(existingUser.id, {});
	return redirect("/", {
		headers: {
			"Set-Cookie": lucia.createSessionCookie(session.id).serialize(),
		},
	});
};

export default function LoginRoute() {
	return (
		<div>
			<form method="post">
				<label htmlFor="email">email</label>
				<input name="email" id="email" />
				<br />
				<label htmlFor="password">Password</label>
				<input type="password" name="password" id="password" />
				<br />
				<button>Continue</button>
			</form>
		</div>
	);
}
