import { useTypedLoaderData } from "remix-typedjson";
import type { loader } from "./route";
import { Header } from "~/components/typeography";
import { Button } from "~/components/ui/button";
import { useNavigate } from "@remix-run/react";
import { Cell, Column, Row, Table, TableHeader } from "~/components/ui/aria-table";
import { MenuTrigger, SubmenuTrigger, TableBody } from "react-aria-components";
import { useSort } from "~/hooks/sort";
import type { NoteWithLinks } from "@repo/db";
import { Toolbar } from "~/components/ui/toolbar";
import { SearchField } from "~/components/ui/search";
import { Menu, MenuItem } from "~/components/ui/menu";
import { useState } from "react";
import { Container } from "~/components/layout";
import { useSearch } from "~/hooks/search";
import { useFilter } from "~/hooks/filter";
import { useAppData } from "../_app/route";

export default function NotesView() {
	const { allNotes } = useTypedLoaderData<typeof loader>();
	const { allFolders } = useAppData();
	const [isSelecting, setIsSelecting] = useState(false);

	const navigate = useNavigate();

	const { searchTerm, setSearchTerm, results } = useSearch(allNotes);
	const { filteredFolders, setFilteredFolders, output, clearFilter } = useFilter(results);

	return (
		<Container className="space-y-4">
			<Header style="h1">All Notes</Header>
			<Toolbar>
				<SearchField value={searchTerm} onChange={(e) => setSearchTerm(e)} />
				<MenuTrigger>
					<Button size="sm">Menu</Button>
					<Menu>
						<MenuItem onAction={() => navigate("/notes/new")}>Create New</MenuItem>
						<MenuItem onAction={() => setIsSelecting(!isSelecting)}>Select</MenuItem>
						<MenuItem>Delete</MenuItem>
						<MenuItem>Link To...</MenuItem>
					</Menu>
				</MenuTrigger>
				<MenuTrigger>
					<Button size="sm" variant="secondary">
						Filter
					</Button>
					<Menu>
						<SubmenuTrigger>
							<MenuItem>Folders...</MenuItem>
							<Menu
								items={allFolders}
								selectionMode="multiple"
								selectedKeys={filteredFolders}
								onSelectionChange={(keys) => {
									if (keys !== "all") {
										const ids = [...keys].map((k) => k.toString());
										setFilteredFolders(ids);
									}
								}}
							>
								{(item) => <MenuItem>{item.name}</MenuItem>}
							</Menu>
						</SubmenuTrigger>
						<MenuItem>Linked</MenuItem>
						<MenuItem>No Link</MenuItem>
					</Menu>
				</MenuTrigger>
				{filteredFolders.length > 0 && (
					<Button variant="secondary" size="sm" onPress={() => clearFilter()}>
						Clear
					</Button>
				)}
			</Toolbar>
			<TableOfNotes notes={output} isSelecting={isSelecting} />
		</Container>
	);
}

interface TableOfNotesProps {
	notes: NoteWithLinks[];
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
				<Column id="folder" isRowHeader width={"1fr"}>
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
						<Cell>{note.folder.name}</Cell>
						<Cell>{note.createdAt.toLocaleString("gmt")}</Cell>
					</Row>
				)}
			</TableBody>
		</Table>
	);
}
