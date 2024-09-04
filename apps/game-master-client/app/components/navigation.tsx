import { Link } from "@remix-run/react";

export function NavigationBar() {
  return (
    <nav className="bg-stone-900 text-stone-100 p-4 w-full flex gap-3">
      <Link to="/signup">Sign Up</Link>
      <Link to="/login">Login</Link>
      <Link to="/games">Games</Link>
    </nav>
  )
}
