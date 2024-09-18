import { Outlet } from "@remix-run/react";

export default function CharacterLayout() {
	return (
		<div>
			<p>Hello this is the character layout</p>
      <Outlet />
		</div>
	);
}
