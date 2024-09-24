import { FilePlusIcon, PlusIcon } from "@radix-ui/react-icons";
import { useParams } from "@remix-run/react";
import type { Game, GameWithData } from "@repo/api";
import { useEffect } from "react";
import { Group } from "react-aria-components";
import { SignoutButton } from "~/components/signout";
import { Link } from "~/components/ui/link";
import { JollyMenu, MenuItem } from "~/components/ui/menu";
import {
	Select,
	SelectItem,
	SelectListBox,
	SelectPopover,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";
import { useGameSelectionId, useSetGameSelection } from "~/store/selection";

interface GameSidebarProps {
	gamesWithNotes: GameWithData[];
}

export function GameSidebar({ gamesWithNotes }: GameSidebarProps) {
	const selectedGame = useGameSelectionId();
	const updateSelection = useSetGameSelection();
	const params = useParams();

	// TODO: This should maybe be a hook, could be useful through the app
	useEffect(() => {
		if (params.gameId && selectedGame !== params.gameId) {
			updateSelection(params.gameId);
		}
	});

	const gameNotes = gamesWithNotes.find((game) => game.id === selectedGame)?.notes;

	return (
		<aside className="w-64 border-r fixed h-full overflow-y-auto p-4 space-y-4">
			<SignoutButton />
			<SidebarTools
				games={gamesWithNotes}
				selectedGame={selectedGame}
				setSelectedGame={updateSelection}
			/>
			<Group className={"flex flex-col gap-2 items-start"} aria-label="Note list">
				{gameNotes?.map((note) => (
					<Link
						key={note.id}
						variant={"link"}
						href={`/games/${selectedGame}/notes/${note.id}`}
						className={"text-wrap h-fit"}
					>
						{note.name}
					</Link>
				))}
			</Group>
		</aside>
	);
}

interface SidebarToolsProps {
	selectedGame: string;
	setSelectedGame: (key: string) => void;
	games: Game[];
}

function SidebarTools({ selectedGame, setSelectedGame, games }: SidebarToolsProps) {
	return (
		<Group className={"flex gap-2 w-full"} aria-label="Game tools">
			<Select
				selectedKey={selectedGame}
				onSelectionChange={(key) => setSelectedGame(key.toString())}
				className={"flex-1 min-w-0"}
				aria-label="Game select dropdown"
			>
				<SelectTrigger>
					<SelectValue />
				</SelectTrigger>
				<SelectPopover>
					<SelectListBox items={games}>
						{(item) => <SelectItem href={`/games/${item.id}`}>{item.name}</SelectItem>}
					</SelectListBox>
				</SelectPopover>
			</Select>
			<NewEntityMenu selectedGame={selectedGame} />
			<Link
				variant={"outline"}
				size={"icon"}
				className={"flex-grow-0 flex-shrink-0"}
				href="/games/new"
			>
				<PlusIcon />
			</Link>
		</Group>
	);
}

interface NewEntityMenuProps {
	selectedGame: string;
}
function NewEntityMenu({ selectedGame }: NewEntityMenuProps) {
	return (
		<JollyMenu label={<FilePlusIcon />} size={"icon"} variant={"outline"} aria-label="New item menu">
			<MenuItem href={`/games/${selectedGame}/notes/new`}>Note</MenuItem>
			<MenuItem href={`/games/${selectedGame}/characters/new`}>Character</MenuItem>
			<MenuItem href={`/games/${selectedGame}/factions/new`}>Faction</MenuItem>
		</JollyMenu>
	);
}
