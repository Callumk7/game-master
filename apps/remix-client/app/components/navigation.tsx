import { Group } from "react-aria-components";
import { NavLink } from "./ui/link";
import { Toolbar } from "./ui/toolbar";

interface NavigationLinksProps {
	links: {
		name: string;
		href: string;
	}[];
}

export function NavigationLinks({ links }: NavigationLinksProps) {
	return (
    <Toolbar>
      <Group aria-label="Navigation links" className="flex gap-4">
        {links.map((link) => (
          <NavLink key={link.name} href={link.href}>
            {link.name}
          </NavLink>
        ))}
      </Group>
    </Toolbar>
	);
}
