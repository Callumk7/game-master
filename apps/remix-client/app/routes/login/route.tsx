import {
	ActionFunctionArgs,
	LoaderFunctionArgs,
	json,
	redirect,
} from "@remix-run/cloudflare";
import { Form, useLoaderData, useNavigate } from "@remix-run/react";
import { createDrizzleForTurso, getValidUser } from "@repo/db";
import { z } from "zod";
import { zx } from "zodix";
import { MainContainer } from "~/components/layout";
import { Button } from "~/components/ui/button";
import { TextField } from "~/components/ui/text-field";
import { commitSession, getUserSession } from "~/lib/auth";

export const loader = async ({ request, params, context }: LoaderFunctionArgs) => {
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

export const action = async ({ request, params, context }: ActionFunctionArgs) => {
	const session = await getUserSession(request);
	const result = await zx.parseFormSafe(request, {
		email: z.string().email(),
		password: z.string(),
	});

	if (!result.success) {
		return { error: result.error };
	}

	const { password, email } = result.data;
	const db = createDrizzleForTurso(context.cloudflare.env);

	const validUser = await getValidUser(db, email, password);

	if (!validUser) {
		session.flash("error", "Invalid username/password");

		// Redirect back to the login page with errors.
		return redirect("/login", {
			headers: {
				"Set-Cookie": await commitSession(session),
			},
		});
	}

	session.set("userId", validUser.id);

	return redirect("/", {
		headers: {
			"Set-Cookie": await commitSession(session),
		},
	});
};

export default function LoginRoute() {
	const { error } = useLoaderData<typeof loader>();
	const emailError = "You must provide an email";
	const passwordError = "You must provide a password";

	const navigate = useNavigate();

	return (
		<MainContainer>
			<Form method="POST">
				<div className="flex flex-col gap-3">
					<p className="text-destructive-9">{error}</p>
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
					<Button type="submit">Login</Button>
					<Button onPress={() => navigate("/signup")} variant="outline">
						Need an account? Sign up!
					</Button>
				</div>
			</Form>
		</MainContainer>
	);
}
