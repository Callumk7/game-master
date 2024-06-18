import type { Folder } from "@repo/db";
import { useState } from "react";

type NoteWithFolder = {
	name: string;
	id: string;
	folder: Folder;
};
export const useFilter = <T extends NoteWithFolder>(items: T[]) => {
	const [filteredFolders, setFilteredFolders] = useState<string[]>([]);

	let output: T[] = [...items];
	if (filteredFolders.length > 0) {
		output = output.filter((item) => filteredFolders.includes(item.folder.id));
	}

	// Tools
	const addFolderToFilter = (folderId: string) => {
		setFilteredFolders((prevState) => [...prevState, folderId]);
	};

	const clearFilter = () => {
		setFilteredFolders([]);
	};

	const removeFolderFromFilter = (folderId: string) => {
		const newState = filteredFolders.filter((item) => item !== folderId);
		setFilteredFolders(newState);
	};

	return {
		filteredFolders,
		setFilteredFolders,
		output,
		addFolderToFilter,
		removeFolderFromFilter,
		clearFilter,
	};
};
