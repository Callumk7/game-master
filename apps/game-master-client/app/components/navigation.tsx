import { Link as AriaLink, type LinkProps as AriaLinkProps } from "react-aria-components";

const links = [{ label: "Games", href: "/games" }];

export function NavigationBar() {
	return (
		<nav className="w-full py-4 px-6 bg-sky-950">
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

interface LinkProps extends AriaLinkProps {}

export function Link({ className, children, ...props }: LinkProps) {
	return (
		<AriaLink className="text-orange-400" {...props}>
			{children}
		</AriaLink>
	);
}
