import { Link } from "@tanstack/react-router";

export function LogoutButton() {
  return (
    <Link
      to="/logout"
      className="bg-red-300 p-3 text-amber-800 font-semibold shadow-amber-200 shadow-md"
    >
      Logout
    </Link>
  );
}
