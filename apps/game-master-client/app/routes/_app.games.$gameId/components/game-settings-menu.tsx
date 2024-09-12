import type { Id } from "@repo/api";
import { Button } from "~/components/ui/button";
import { Menu, MenuItem, MenuPopover, MenuTrigger } from "~/components/ui/menu";

interface GameSettingsMenuProps {
	gameId: Id;
}

export function GameSettingsMenu({ gameId }: GameSettingsMenuProps) {
	return (
		<MenuTrigger>
			<Button variant={"outline"}>Game Settings</Button>
			<MenuPopover>
				<Menu>
					<MenuItem>Members</MenuItem>
					<MenuItem>Update</MenuItem>
					<MenuItem>Delete Game</MenuItem>
				</Menu>
			</MenuPopover>
		</MenuTrigger>
	);
}
