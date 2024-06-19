import { useTypedLoaderData } from "remix-typedjson";
import type { loader } from "./route";
import { Header } from "~/components/typeography";
import { Button } from "~/components/ui/button";
import { useNavigate, useSubmit } from "@remix-run/react";
import { MenuTrigger, SubmenuTrigger } from "react-aria-components";
import { Toolbar } from "~/components/ui/toolbar";
import { SearchField } from "~/components/ui/search";
import { Menu, MenuItem } from "~/components/ui/menu";
import { useState } from "react";
import { Container } from "~/components/layout";
import { useSearch } from "~/hooks/search";
import { useFilter } from "~/hooks/filter";
import { useAppData } from "../_app/route";
import { TableOfNotes } from "./components/notes-table";

export default function NotesIndexView() {
	const { allNotes } = useTypedLoaderData<typeof loader>();
	const { allFolders } = useAppData();

	const [isSelecting, setIsSelecting] = useState(false);
	const [selectedNotes, setSelectedNotes] = useState<string[]>([]); // noteIds

	const navigate = useNavigate();
	const submit = useSubmit();

	const { searchTerm, setSearchTerm, results } = useSearch(allNotes);
	const { filteredFolders, setFilteredFolders, output, clearFilter } = useFilter(results);

	const handleBulkDelete = () => {
		const form = new FormData();
		selectedNotes.forEach((id) => form.append("noteIds", id));
		submit(form, { method: "DELETE" });
		setSelectedNotes([]);
	};

	return (
		<Container className="space-y-4">
			<Header style="h1">All Notes</Header>
			<Toolbar>
				<SearchField value={searchTerm} onChange={(e) => setSearchTerm(e)} />
				<MenuTrigger>
					<Button size="sm">Menu</Button>
					<Menu>
						<MenuItem onAction={() => navigate("/notes/new")}>Create New</MenuItem>
						<MenuItem onAction={() => setIsSelecting(!isSelecting)}>
							Toggle Select Mode
						</MenuItem>
						<MenuItem onAction={handleBulkDelete} isDisabled={!isSelecting}>
							Delete
						</MenuItem>
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
			<TableOfNotes
				notes={output}
				isSelecting={isSelecting}
				setSelectedNotes={setSelectedNotes}
				selectedNotes={selectedNotes}
			/>
		</Container>
	);
}
