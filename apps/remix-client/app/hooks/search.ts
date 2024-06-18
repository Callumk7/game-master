import type { BasicEntity } from "@repo/db";
import { useState } from "react";

export const useSearch = <T extends BasicEntity>(items: T[]) => {
	const [searchTerm, setSearchTerm] = useState("");
	let results: T[] = [...items];
	if (searchTerm !== "") {
		results = results.filter((item) =>
			item.name.toLowerCase().includes(searchTerm.toLowerCase()),
		);
	}
	return {
		searchTerm,
		setSearchTerm,
		results,
	};
};
