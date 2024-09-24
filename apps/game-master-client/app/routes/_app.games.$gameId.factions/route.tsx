import { Outlet } from "@remix-run/react";
import { useIsRightSidebarOpen, useSetRightSidebarOpen } from "~/store/selection";

export default function FactionLayout() {
  const setIsRightSidebarOpen = useSetRightSidebarOpen();
  setIsRightSidebarOpen(false);
	return (
		<div>
			<Outlet />
		</div>
	);
}
