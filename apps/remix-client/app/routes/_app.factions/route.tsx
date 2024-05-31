import { Outlet } from "@remix-run/react";
import { MainContainer } from "~/components/layout";

export default function FactionRoute() {
	return (
		<MainContainer width="max">
			<Outlet />
		</MainContainer>
	);
}
