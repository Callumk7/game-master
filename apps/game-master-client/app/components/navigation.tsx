import { useAppData } from "~/routes/_app/route";
import { Link } from "./ui/link";

const links = [{ label: "Games", href: "/games" }];

export function NavigationBar() {
  const { user } = useAppData();
  return (
    <nav className="w-full py-4 px-6 bg-primary/80">
      <p>{user.email}</p>
      <ul>
        {links.map((link) => (
          <li key={link.href}>
            <Link variant="link" href={link.href}>{link.label}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
