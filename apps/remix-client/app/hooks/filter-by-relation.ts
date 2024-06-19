import type { CharacterWithRaceAndFactions, FilterableEntity } from "@repo/db";
import { useState } from "react";

export const useCharacterFilter = (input: CharacterWithRaceAndFactions[]) => {
	let output = [...input];

	const [factionFilter, setFactionFilter] = useState<string[]>([]);
	const [raceFilter, setRaceFilter] = useState<string[]>([]);

	if (factionFilter.length > 0) {
		output = output.filter((item) =>
			item.factions.some((faction) => factionFilter.includes(faction.id)),
		);
	}
	if (raceFilter.length > 0) {
		output = output.filter((item) => raceFilter.includes(item.race.id));
	}
	const handleFactionFilter = (keys: string[]) => {
		setFactionFilter(keys);
	};
	const handleRaceFilter = (keys: string[]) => {
		setRaceFilter(keys);
	};
	const handleClearAllFilters = () => {
		setFactionFilter([]);
		setRaceFilter([]);
	};

	const isFilterActive = raceFilter.length > 0 || factionFilter.length > 0;

	return {
		output,
		factionFilter,
		raceFilter,
		handleFactionFilter,
		handleRaceFilter,
		handleClearAllFilters,
		isFilterActive,
	};
};
