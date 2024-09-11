import { PlusIcon } from "@radix-ui/react-icons";
import { useNavigate } from "@remix-run/react";
import type { Game, GameWithData } from "@repo/api";
import { useState } from "react";
import { Group } from "react-aria-components";
import { Button } from "~/components/ui/button";
import { Link } from "~/components/ui/link";
import {
	Select,
	SelectItem,
	SelectListBox,
	SelectPopover,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";

interface GameSidebarProps {
	gamesWithNotes: GameWithData[];
}

export function GameSidebar({ gamesWithNotes }: GameSidebarProps) {
	const [selectedGame, setSelectedGame] = useState(gamesWithNotes[0].id);
	const gameNotes = gamesWithNotes.find((game) => game.id === selectedGame)?.notes;
	return (
		<aside className="w-64 border-r fixed h-full overflow-y-auto p-4 space-y-4">
			<SelectGame
				games={gamesWithNotes}
				selectedGame={selectedGame}
				setSelectedGame={setSelectedGame}
			/>
			<Group className={"flex flex-col gap-2 items-start"}>
				{gameNotes?.map((note) => (
					<Link
						key={note.id}
						variant={"link"}
						href={`/games/${selectedGame}/notes/${note.id}`}
					>
						{note.name}
					</Link>
				))}
			</Group>
		</aside>
	);
}

interface SelectGameProps {
	selectedGame: string;
	setSelectedGame: (key: string) => void;
	games: Game[];
}

function SelectGame({ selectedGame, setSelectedGame, games }: SelectGameProps) {
	const navigate = useNavigate();
	return (
		<Group className={"flex gap-2 w-full"}>
			<Select
				selectedKey={selectedGame}
				onSelectionChange={(key) => setSelectedGame(key.toString())}
				className={"flex-1 min-w-0"}
			>
				<SelectTrigger>
					<SelectValue />
				</SelectTrigger>
				<SelectPopover>
					<SelectListBox items={games}>
						{(item) => <SelectItem>{item.name}</SelectItem>}
					</SelectListBox>
				</SelectPopover>
			</Select>
			<Button
				variant={"outline"}
				size={"icon"}
				className={"flex-grow-0 flex-shrink-0"}
				onPress={() => navigate(`/games/${selectedGame}`)}
			>
				<PlusIcon />
			</Button>
		</Group>
	);
}
