import { type LoaderFunctionArgs, json } from "@remix-run/node";
import { createApi } from "~/lib/api.server";
import { validateUser } from "~/lib/auth.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const userId = await validateUser(request);
	const api = createApi(userId);
	const allUsers = await api.users.getAllUsers();
	return json(allUsers);
};
