import { Outlet } from "@remix-run/react";
import { MainContainer } from "~/components/layout";

export default function SessionsRoute() {
	return (
		<MainContainer width="max" top="none">
			<Outlet />
		</MainContainer>
	);
}
