import { Cell, Column, Row, Table, TableHeader } from "~/components/ui/aria-table";
import { type Selection, TableBody } from "react-aria-components";
import { useSort } from "~/hooks/sort";
import type { NoteWithLinks } from "@repo/db";
import { Header } from "~/components/typeography";

interface TableOfNotesProps {
	notes: NoteWithLinks[];
	isSelecting: boolean;
	selectedNotes: string[];
	setSelectedNotes: (selectedNotes: string[]) => void;
}
export function TableOfNotes({
	notes,
	isSelecting,
	selectedNotes,
	setSelectedNotes,
}: TableOfNotesProps) {
	const sort = useSort(notes, "name");

	const handleSelectionChange = (keys: Selection) => {
		if (keys !== "all") {
			const ids = [...keys].map((k) => k.toString());
			setSelectedNotes(ids);
		} else {
			if (selectedNotes.length > 0) {
				setSelectedNotes([]);
			} else {
				setSelectedNotes(notes.map((note) => note.id));
			}
		}
	};

	return (
		<Table
			sortDescriptor={sort.sortDescriptor}
			onSortChange={sort.handleSortChange}
			aria-label="note table"
			selectionMode={isSelecting ? "multiple" : "none"}
			selectedKeys={selectedNotes}
			onSelectionChange={handleSelectionChange}
		>
			<TableHeader>
				<Column id="name" isRowHeader width={"2fr"} allowsSorting>
					Title
				</Column>
				<Column id="folder" isRowHeader width={"1fr"} allowsSorting>
					Folder
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
						<Cell>
							<Header style="h5" colour="amber">
								{note.folder?.name ?? ""}
							</Header>
						</Cell>
						<Cell>{note.createdAt.toLocaleString("gmt")}</Cell>
					</Row>
				)}
			</TableBody>
		</Table>
	);
}
