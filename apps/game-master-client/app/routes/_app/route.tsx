import type { LoaderFunctionArgs } from "@remix-run/node";
import { Outlet, useHref, useNavigate } from "@remix-run/react";
import { RouterProvider } from "react-aria-components";
import { validateUser } from "~/lib/auth.server";
import { api, extractDataFromResponseOrThrow } from "~/lib/api.server";
import { typedjson, useTypedRouteLoaderData } from "remix-typedjson";

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const userId = await validateUser(request);
	const userResult = await api.users.getUser(userId);
	const user = extractDataFromResponseOrThrow(userResult);

	return typedjson({ user });
};

export default function AppLayout() {
	const navigate = useNavigate();
	return (
		<RouterProvider navigate={navigate} useHref={useHref}>
      <Outlet />
		</RouterProvider>
	);
}

export function useAppData() {
	const data = useTypedRouteLoaderData<typeof loader>("routes/_app");
	if (data === undefined) {
		throw new Error("useAppData must be used within the _app route or its children");
	}
	return data;
}
