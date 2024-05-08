import { eq } from "drizzle-orm";
import { DB } from "~/db";
import { folders } from "~/db/schemas/notes";

export const getUserFolders = async (db: DB, userId: string) => {
	return await db.select().from(folders).where(eq(folders.userId, userId));
};
