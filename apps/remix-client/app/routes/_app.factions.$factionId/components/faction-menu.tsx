import { MenuTrigger } from "react-aria-components";
import { Button } from "~/components/ui/button";
import { Menu, MenuItem } from "~/components/ui/menu";

export function FactionMenu({ factionId }: { factionId: string }) {
	return (
		<MenuTrigger>
			<Button aria-label="Faction Options">Menu</Button>
			<Menu>
				<MenuItem href={`/factions/${factionId}/members`}>Members</MenuItem>
				<MenuItem href={`/factions/${factionId}/notes`}>Notes</MenuItem>
				<MenuItem href={`/factions/${factionId}/links`}>Links</MenuItem>
			</Menu>
		</MenuTrigger>
	);
}
