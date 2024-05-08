import { FilterableEntity } from "@repo/db";
import { useState } from "react";
import { Key, Selection } from "react-stately";

export const useFilterByRelation = <T extends FilterableEntity>(input: T[]) => {
	let output = [...input];

	const [charFilter, setCharFilter] = useState<Key[]>([]);
	const [factionFilter, setFactionFilter] = useState<Key[]>([]);
	const [seshFilter, setSeshFilter] = useState<Key[]>([]);

	if (charFilter.length > 0) {
		output = output.filter((item) =>
			item.characters.some((char) => charFilter.includes(char.id)),
		);
	}
	if (factionFilter.length > 0) {
		output = output.filter((item) =>
			item.factions.some((faction) => factionFilter.includes(faction.id)),
		);
	}
	if (seshFilter.length > 0) {
		output = output.filter((item) =>
			item.sessions.some((sesh) => seshFilter.includes(sesh.id)),
		);
	}
	const handleCharFilter = (keys: Selection) => {
		if (keys !== "all") {
			setCharFilter([...keys]);
		}
	};
	const handleFactionFilter = (keys: Selection) => {
		if (keys !== "all") {
			setFactionFilter([...keys]);
		}
	};
	const handleSessionFilter = (keys: Selection) => {
		if (keys !== "all") {
			setSeshFilter([...keys]);
		}
	};
	const handleClearAllFilters = () => {
		setCharFilter([]);
		setFactionFilter([]);
		setSeshFilter([]);
	};

	return {
		output,
		charFilter,
		factionFilter,
		seshFilter,
		handleCharFilter,
		handleSessionFilter,
		handleFactionFilter,
		handleClearAllFilters,
	};
};
