import { useAppData } from "~/routes/_app/route";
import { Menu, MenuItem, MenuPopover, MenuTrigger } from "./ui/menu";
import { Button } from "./ui/button";
import type { Game } from "@repo/api";

interface NavigationBarProps {
	games: Game[];
}
export function NavigationBar({ games }: NavigationBarProps) {
	const { user } = useAppData();
	return (
		<nav className="w-full flex justify-between py-4 px-6 bg-primary/80">
			<MenuTrigger>
				<Button variant="ghost">Games</Button>
				<MenuPopover>
          <Menu items={games}>
            {(item) => <MenuItem href={`/games/${item.id}`}>{item.name}</MenuItem>}
          </Menu>
				</MenuPopover>
			</MenuTrigger>
			<p>{user.email}</p>
		</nav >
	);
}
