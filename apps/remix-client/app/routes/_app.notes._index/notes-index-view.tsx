import { useTypedLoaderData } from "remix-typedjson";
import { loader } from "./route";
import { Header } from "~/components/typeography";
import { Button } from "~/components/ui/button";
import { useNavigate } from "@remix-run/react";
import { Cell, Column, Row, Table, TableHeader } from "~/components/ui/aria-table";
import { TableBody } from "react-aria-components";
import { useSortTable } from "~/hooks/sort-table";
import { Tag, TagGroup } from "~/components/ui/tag-group";
import { Note } from "@repo/db";

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

	return (
		<div className="space-y-4">
			<Header style="h1">All Notes</Header>
			<TableOfNotes notes={formattedNotes} />
			<Button onPress={() => navigate("/notes/new")}>Add</Button>
		</div>
	);
}

interface TableOfNotesProps {
	notes: Note[];
}

export function TableOfNotes({ notes }: TableOfNotesProps) {
	const sort = useSortTable(notes, "name");

	return (
		<Table
			sortDescriptor={sort.sortDescriptor}
			onSortChange={sort.handleSortChange}
			aria-label="note table"
			selectionMode="multiple"
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
