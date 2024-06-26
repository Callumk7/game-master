import { Outlet } from "@remix-run/react";
import { MainContainer } from "~/components/layout";

export default function NotesRoute() {
	return (
		<MainContainer width="max">
			<Outlet />
		</MainContainer>
	);
}
