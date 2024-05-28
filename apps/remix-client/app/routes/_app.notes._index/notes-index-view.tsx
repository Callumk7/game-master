import { useTypedLoaderData } from "remix-typedjson";
import type { loader } from "./route";
import { Header } from "~/components/typeography";
import { Button } from "~/components/ui/button";
import { useNavigate } from "@remix-run/react";
import { Cell, Column, Row, Table, TableHeader } from "~/components/ui/aria-table";
import { DialogTrigger, SubmenuTrigger, TableBody } from "react-aria-components";
import { useSort } from "~/hooks/sort";
import type { Note } from "@repo/db";
import { Toolbar } from "~/components/ui/toolbar";
import { SearchField } from "~/components/ui/search";
import { Menu, MenuItem, MenuSection, MenuSeparator } from "~/components/ui/menu";
import { useState } from "react";

export default function NotesView() {
	const { allNotes } = useTypedLoaderData<typeof loader>();

	// TODO: Extract this
	const formattedNotes = allNotes.map((note) => ({
		...note,
		characters: note.characters.map((c) => c.character),
		factions: note.factions.map((f) => f.faction),
		sessions: note.sessions.map((s) => s.session),
		plots: note.plots.map((p) => p.plot),
	}));

	const navigate = useNavigate();

	const [isSelecting, setIsSelecting] = useState(false);

	return (
		<div className="space-y-4">
			<Header style="h1">All Notes</Header>
			<Toolbar>
				<SearchField />
				<DialogTrigger>
					<Button size="sm">Menu</Button>
					<Menu>
						<MenuItem onAction={() => navigate("/notes/new")}>Create New</MenuItem>
						<MenuItem onAction={() => setIsSelecting(!isSelecting)}>Select</MenuItem>
						<MenuItem>Delete</MenuItem>
						<MenuItem>Link To...</MenuItem>
					</Menu>
				</DialogTrigger>
			</Toolbar>
			<TableOfNotes notes={formattedNotes} isSelecting={isSelecting} />
		</div>
	);
}

interface TableOfNotesProps {
	notes: Note[];
	isSelecting: boolean;
}

export function TableOfNotes({ notes, isSelecting }: TableOfNotesProps) {
	const sort = useSort(notes, "name");

	return (
		<Table
			sortDescriptor={sort.sortDescriptor}
			onSortChange={sort.handleSortChange}
			aria-label="note table"
			selectionMode={isSelecting ? "multiple" : "none"}
		>
			<TableHeader>
				<Column id="name" isRowHeader width={"2fr"} allowsSorting>
					Title
				</Column>
				<Column id="createdAt" isRowHeader width={"1fr"} allowsSorting>
					Created At
				</Column>
			</TableHeader>
			<TableBody items={sort.sortedItems}>
				{(note) => (
					<Row href={`/notes/${note.id}`}>
						<Cell>
							<p className="whitespace-pre-wrap">{note.name}</p>
						</Cell>
						<Cell>{note.createdAt.toLocaleString("gmt")}</Cell>
					</Row>
				)}
			</TableBody>
		</Table>
	);
}
