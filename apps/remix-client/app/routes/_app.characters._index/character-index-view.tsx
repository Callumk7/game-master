import { MenuTrigger, SubmenuTrigger } from "react-aria-components";
import { useTypedLoaderData } from "remix-typedjson";
import { Header } from "~/components/typeography";
import { Button } from "~/components/ui/button";
import { CharacterTable } from "./components/character-table";
import { Container } from "~/components/layout";
import { useSearch } from "~/hooks/search";
import { SearchField } from "~/components/ui/search";
import { Toolbar } from "~/components/ui/toolbar";
import { Menu, MenuItem } from "~/components/ui/menu";
import { useState } from "react";
import { useSubmit } from "@remix-run/react";
import type { loader } from "./route";
import { useCharacterFilter } from "~/hooks/filter-by-relation";
import { useAppData } from "../_app/route";

export function CharacterIndexView() {
	const { allCharacters } = useTypedLoaderData<typeof loader>();
	const { allRaces, allFactions } = useAppData();
	const submit = useSubmit();

	const { searchTerm, setSearchTerm, results } = useSearch(allCharacters);
	const filter = useCharacterFilter(results);

	const [isSelecting, setIsSelecting] = useState(false);
	const [selectedChars, setSelectedChars] = useState<string[]>([]); // noteIds

	const handleBulkDelete = () => {
		const form = new FormData();
		selectedChars.forEach((id) => form.append("characterIds", id));
		submit(form, { method: "DELETE" });
		setSelectedChars([]);
	};

	return (
		<Container className="space-y-4">
			<Header style="h1">All Characters</Header>
			<Toolbar>
				<SearchField value={searchTerm} onChange={(e) => setSearchTerm(e)} />
				<MenuTrigger>
					<Button size="sm">Menu</Button>
					<Menu>
						<MenuItem>Create New</MenuItem>
						<MenuItem onAction={() => setIsSelecting(!isSelecting)}>
							Toggle Select Mode
						</MenuItem>
						<MenuItem onAction={handleBulkDelete} isDisabled={!isSelecting}>
							Delete
						</MenuItem>
					</Menu>
				</MenuTrigger>
				<MenuTrigger>
					<Button size="sm" variant="secondary">
						Filters
					</Button>
					<Menu>
						<SubmenuTrigger>
							<MenuItem>Races</MenuItem>
							<Menu
								items={allRaces}
								selectionMode="multiple"
								selectedKeys={filter.raceFilter}
								onSelectionChange={(keys) => {
									if (keys !== "all") {
										const ids = [...keys].map((k) => k.toString());
										filter.handleRaceFilter(ids);
									}
								}}
							>
								{(item) => <MenuItem>{item.name}</MenuItem>}
							</Menu>
						</SubmenuTrigger>
						<SubmenuTrigger>
							<MenuItem>Factions</MenuItem>
							<Menu
								items={allFactions}
								selectionMode="multiple"
								selectedKeys={filter.factionFilter}
								onSelectionChange={(keys) => {
									if (keys !== "all") {
										const ids = [...keys].map((k) => k.toString());
										filter.handleFactionFilter(ids);
									}
								}}
							>
								{(item) => <MenuItem>{item.name}</MenuItem>}
							</Menu>
						</SubmenuTrigger>
					</Menu>
				</MenuTrigger>
				{filter.isFilterActive && (
					<Button
						size="sm"
						variant="secondary"
						onPress={() => filter.handleClearAllFilters()}
					>
						Clear
					</Button>
				)}
			</Toolbar>
			<CharacterTable
				characters={filter.output}
				isSelecting={isSelecting}
				selectedChars={selectedChars}
				setSelectedChars={setSelectedChars}
			/>
		</Container>
	);
}
