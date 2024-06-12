import { type Key, MenuTrigger, type Selection } from "react-aria-components";
import { Toolbar } from "./ui/toolbar";
import { Button } from "./ui/button";
import { Menu, MenuItem } from "./ui/menu";
import type { BasicEntity } from "@repo/db";

export function EntityFilter({
	allChars,
	allFactions,
	allSessions,
	charFilter,
	factionFilter,
	sessionFilter,
	handleCharFilter,
	handleFactionFilter,
	handleSessionFilter,
	handleClearAllFilters,
}: {
	allChars: BasicEntity[];
	allFactions: BasicEntity[];
	allSessions: BasicEntity[];
	charFilter: Key[];
	factionFilter: Key[];
	sessionFilter: Key[];
	handleCharFilter: (keys: Selection) => void;
	handleFactionFilter: (keys: Selection) => void;
	handleSessionFilter: (keys: Selection) => void;
	handleClearAllFilters: () => void;
}) {
	return (
		<Toolbar>
			<MenuTrigger>
				<Button size="sm">Character Filter</Button>
				<Menu
					items={allChars}
					onSelectionChange={handleCharFilter}
					selectionMode="multiple"
					selectedKeys={charFilter}
				>
					{(char) => <MenuItem>{char.name}</MenuItem>}
				</Menu>
			</MenuTrigger>
			<MenuTrigger>
				<Button size="sm">Faction Filter</Button>
				<Menu
					items={allFactions}
					onSelectionChange={handleFactionFilter}
					selectionMode="multiple"
					selectedKeys={factionFilter}
				>
					{(faction) => <MenuItem>{faction.name}</MenuItem>}
				</Menu>
			</MenuTrigger>
			<MenuTrigger>
				<Button size="sm">Session Filter</Button>
				<Menu
					items={allSessions}
					onSelectionChange={handleSessionFilter}
					selectionMode="multiple"
					selectedKeys={sessionFilter}
				>
					{(char) => <MenuItem>{char.name}</MenuItem>}
				</Menu>
			</MenuTrigger>
			<Button variant="destructive" size="sm" onPress={() => handleClearAllFilters()}>
				Clear
			</Button>
		</Toolbar>
	);
}
