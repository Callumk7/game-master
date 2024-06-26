import { Character, Faction, Note } from "@repo/db";
import { DialogTrigger } from "react-aria-components";
import { EntityListBox } from "~/components/entity-listbox";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/field";
import { Link } from "~/components/ui/link";
import { Menu, MenuItem } from "~/components/ui/menu";
import { Toolbar } from "~/components/ui/toolbar";

type NoteTree = Note & {
	characters: Character[];
	factions: Faction[];
};

interface CharacterSidebarProps {
	notes: NoteTree[];
}
export function CharacterSidebar({ notes }: CharacterSidebarProps) {
	return (
		<div className="fixed px-3 pt-5 space-y-6 h-full min-h-screen max-h-screen border-r bg-primary-2 border-grade-6 min-w-[15vw] max-w-56">
			<SidebarSorter />
			<div className="space-y-4">
				{notes.map((note) => (
					<div key={note.id} className="flex flex-col gap-2">
						<Link>{note.name}</Link>
						<Label>Characters</Label>
						<EntityListBox items={note.characters} type="characters" />
						<Label>Factions</Label>
						<EntityListBox items={note.factions} type="factions" />
					</div>
				))}
			</div>
		</div>
	);
}

function SidebarSorter() {
	return (
		<Toolbar>
			<DialogTrigger>
				<Button size="sm" variant="secondary">Sort</Button>
				<Menu>
					<MenuItem>Name</MenuItem>
					<MenuItem>Created</MenuItem>
				</Menu>
			</DialogTrigger>
		</Toolbar>
	);
}
