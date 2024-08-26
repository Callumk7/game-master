import { Link, Outlet } from "@remix-run/react";

export default function AppLayout() {
	return (
		<div className="space-y-4">
      <nav className="flex gap-2">
        <Link to="/">Home</Link>
        <Link to="notes">Notes</Link>
      </nav>
			<Outlet />
		</div>
	);
}
