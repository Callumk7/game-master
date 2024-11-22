import type { BasicEntity } from "@repo/api";
import Fuse from "fuse.js";
import { useState } from "react";

type EntitySearchOptions = {
	shouldSort?: boolean;
	threshold?: number;
	keys?: string[];
};

export const useEntitySearch = <E extends BasicEntity>(
	entities: E[],
	options?: EntitySearchOptions,
) => {
	const [searchTerm, setSearchTerm] = useState("");

	let result = [...entities];

	const fuse = new Fuse(entities, {
		shouldSort: options?.shouldSort,
		threshold: options?.threshold,
		keys: options?.keys ?? ["name"],
	});

	if (searchTerm.length > 0) {
		result = fuse.search(searchTerm).map((r) => r.item);
	}

	return {
		searchTerm,
		setSearchTerm,
		result,
	};
};
