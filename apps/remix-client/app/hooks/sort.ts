import { useState } from "react";
import type { SortDescriptor } from "react-aria-components";

// biome-ignore lint/suspicious/noExplicitAny:
export const applySort = <T extends Record<string, any>>(
	items: T[],
	sortDescriptor: SortDescriptor,
): T[] => {
	if (!sortDescriptor.column) {
		return items;
	}
	const sortedItems = items.sort((a, b) => {
		// biome-ignore lint/style/noNonNullAssertion: Will have column
		const first = a[sortDescriptor.column!];
		// biome-ignore lint/style/noNonNullAssertion: Will have columm
		const second = b[sortDescriptor.column!];
		let cmp = (Number.parseInt(first) || first) < (Number.parseInt(second) || second) ? -1 : 1;
		if (sortDescriptor.direction === "descending") {
			cmp *= -1;
		}
		return cmp;
	});

	return sortedItems;
};

// biome-ignore lint/suspicious/noExplicitAny:
export const useSort = <T extends Record<string, any>>(
	items: T[],
	defaultColumn = "name",
) => {
	const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
		column: defaultColumn,
		direction: "descending",
	});

	const sortedItems = applySort(items, sortDescriptor);

	const handleSortChange = (descriptor: SortDescriptor) => {
		setSortDescriptor(descriptor);
	};

	return {
		sortedItems,
		sortDescriptor,
		handleSortChange,
	};
};
