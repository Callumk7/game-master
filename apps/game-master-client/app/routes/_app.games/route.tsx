import { Outlet } from "@remix-run/react";

export default function GamesLayout() {
	return (
		<div>
			<p>This is the games layout</p>
			<Outlet />
		</div>
	);
}
