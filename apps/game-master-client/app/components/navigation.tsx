import { Link as AriaLink, type LinkProps as AriaLinkProps } from "react-aria-components";
import { useAppData } from "~/routes/_app/route";

const links = [{ label: "Games", href: "/games" }];

export function NavigationBar() {
  const { user } = useAppData();
  return (
    <nav className="w-full py-4 px-6 bg-sky-950">
      <p>{user.email}</p>
      <ul>
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href}>{link.label}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

interface LinkProps extends AriaLinkProps { }

export function Link({ className, children, ...props }: LinkProps) {
  return (
    <AriaLink className="text-orange-400" {...props}>
      {children}
    </AriaLink>
  );
}
