import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/cloudflare";
import { typedjson, useTypedRouteLoaderData } from "remix-typedjson";
import { validateUserSession, getUserId, commitSession } from "~/lib/auth";
import { getAllUserData } from "./queries.server";
import "reactflow/dist/style.css";
import { AppRoute } from "./app-layout";

export const meta: MetaFunction = () => {
	return [
		{ title: "Game Master" },
		{
			name: "description",
			content: "Create the game of your dreams.",
		},
	];
};

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
	const session = await validateUserSession(request);
	const userId = getUserId(session);

	// TODO: This should be split out to other routes as every invalidation made
	// by mutations will cause all data to be refetched. This should be cached
	// and updated, or instead split out into specific routes that require it
	const userData = await getAllUserData(userId, context);

	const error = session.get("error") || null;

	return typedjson(
		{
			session,
			error,
			...userData,
		},
		{
			headers: {
				"Set-Cookie": await commitSession(session),
			},
		},
	);
};

// Custom hook to access _app loader data anywhere in the tree.
// Note, this is not currently revalidated, so it isn't a particularly
// good solution at the moment. It also isn't very remix'y. Probably a
// better solution somewhere.
export function useAppData() {
	const data = useTypedRouteLoaderData<typeof loader>("routes/_app");
	if (data === undefined) {
		throw new Error("useAppData must be used within the _app route or its children");
	}
	return data;
}

export { AppRoute as default };
