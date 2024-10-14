import { type ActionFunction, json } from "@remix-run/node";
import { themeCookie } from "~/lib/theme/theme.server";

export const action: ActionFunction = async ({ request }) => {
	const form = await request.formData();
	const theme = form.get("theme");

	if (typeof theme !== "string") {
		return json({ success: false }, { status: 400 });
	}

	return json(
		{ success: true },
		{
			headers: {
				"Set-Cookie": await themeCookie.serialize(theme),
			},
		},
	);
};
