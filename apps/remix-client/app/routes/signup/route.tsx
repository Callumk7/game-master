import { ActionFunctionArgs } from "@remix-run/cloudflare";
import { Form } from "@remix-run/react";
import { createDrizzleForTurso, users } from "@repo/db";
import { uuidv4 } from "callum-util";
import { redirect } from "remix-typedjson";
import { z } from "zod";
import { zx } from "zodix";
import { MainContainer } from "~/components/layout";
import { Button } from "~/components/ui/button";
import { TextField } from "~/components/ui/text-field";
import { authCookie, commitSession, getSession } from "~/lib/auth";

export const action = async ({ request, params, context }: ActionFunctionArgs) => {
	const result = await zx.parseFormSafe(request, {
		username: z.string(),
		email: z.string().email(),
		password: z.string(),
	});

	if (!result.success) {
		return { error: result.error };
	}

	const { username, password, email } = result.data;

	const db = createDrizzleForTurso(context.cloudflare.env);

	const newUser = await db
		.insert(users)
		.values({ id: `user_${uuidv4()}`, username, email, password })
		.returning({ userId: users.id, username: users.username, email: users.email });

	// const session = createSession({
	// 	userId: newUser[0].id,
	// 	username: newUser[0].username,
	// 	email: newUser[0].email,
	// });

	// I think actually, the cookie should just be set directly..
	const session = await getSession(await authCookie.serialize(newUser[0]));

	return redirect("/", {
		headers: {
			"Set-Cookie": await commitSession(session),
		},
	});
};

export default function SignUpRoute() {
	const emailError = "You must provide an email";
	const passwordError = "You must provide a password";
	const usernameError = "You must provide a username";

	return (
		<MainContainer>
			<Form method="POST">
				<div className="flex flex-col gap-3">
					<TextField label="Username" name="username" errorMessage={usernameError} />
					<TextField
						label="Email"
						name="email"
						type="email"
						isRequired
						errorMessage={emailError}
					/>
					<TextField
						label="Password"
						name="password"
						type="password"
						isRequired
						errorMessage={passwordError}
					/>
					<Button type="submit">Sign Up</Button>
				</div>
			</Form>
		</MainContainer>
	);
}
