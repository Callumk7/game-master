import type { CreateFolderRequestBody } from "@repo/api/dist/types/folders";
import type { InsertDatabaseFolder } from "~/db/schema/notes";
import { generateFolderId } from "~/lib/ids";

export const createFolderInsert = (data: CreateFolderRequestBody): InsertDatabaseFolder => {
	const currentDate = new Date();
	return {
		...data,
		id: generateFolderId(),
		createdAt: currentDate,
		updatedAt: currentDate,
	}
}
