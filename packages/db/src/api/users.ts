import { and, eq } from "drizzle-orm";
import { DB } from "../db";
import { users } from "../db/schemas/users";

export const getValidUser = async (db: DB, email: string, password: string) => {
	return await db.query.users.findFirst({
		where: and(eq(users.email, email), eq(users.password, password)),
	});
};
