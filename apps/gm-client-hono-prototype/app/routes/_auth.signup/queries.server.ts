import { hash } from "@node-rs/argon2";
import { redirect } from "@remix-run/node";
import { generateIdFromEntropySize } from "lucia";
import { db } from "~/db/index";
import { users } from "~/db/schema/users";
import { lucia } from "~/server/auth.server";

export const handleSignup = async (request: Request) => {
	const formData = await request.formData();
	const email = formData.get("email")?.toString();
	// username must be between 4 ~ 31 characters, and only consists of lowercase letters, 0-9, -, and _
	// keep in mind some database (e.g. mysql) are case insensitive
	if (typeof email !== "string" || email.length < 3 || email.length > 31) {
		return new Response("Invalid username", {
			status: 400,
		});
	}
	const password = formData.get("password")?.toString();
	if (typeof password !== "string" || password.length < 6 || password.length > 255) {
		return new Response("Invalid password", {
			status: 400,
		});
	}

	console.log("2");

	const userId = generateIdFromEntropySize(10); // 16 characters long
	const passwordHash = await hash(password, {
		// recommended minimum parameters
		memoryCost: 19456,
		timeCost: 2,
		outputLen: 32,
		parallelism: 1,
	});

	console.log("3");

	// TODO: Check to see if a username is already in use
	await db.insert(users).values({
		id: userId,
		email,
		passwordHash,
	});

	console.log("4");

	const session = await lucia.createSession(userId, {});
	const sessionCookie = lucia.createSessionCookie(session.id);
	return redirect("/", {
		headers: {
			"Set-Cookie": sessionCookie.serialize(),
		},
	});
};
