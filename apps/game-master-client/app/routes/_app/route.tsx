import type { LoaderFunctionArgs } from "@remix-run/node";
import {
	Outlet,
	json,
	useHref,
	useNavigate,
	useRouteLoaderData,
} from "@remix-run/react";
import { RouterProvider } from "react-aria-components";
import { NavigationBar } from "~/components/navigation";
import { validateUser } from "~/lib/auth.server";
import { api } from "~/lib/api.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const userId = await validateUser(request);
	const user = await api.users.getUser(userId);
  console.log(user)
	return json({ user });
};

export default function AppLayout() {
	const navigate = useNavigate();
	return (
		<RouterProvider navigate={navigate} useHref={useHref}>
			<div>
				<NavigationBar />
				<Outlet />
			</div>
		</RouterProvider>
	);
}

export function useAppData() {
	const data = useRouteLoaderData<typeof loader>("routes/_app");
	if (data === undefined) {
		throw new Error("useAppData must be used within the _app route or its children");
	}
	return data;
}
