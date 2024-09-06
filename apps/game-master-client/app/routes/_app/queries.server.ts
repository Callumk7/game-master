import { db } from "db";
import { eq } from "drizzle-orm";
import { users } from "db/schema/users";

export const getUserDetails = async (userId: string) => {
	return await db
		.select({
			id: users.id,
			email: users.email,
			username: users.username,
			firstName: users.firstName,
			lastName: users.lastName,
		})
		.from(users)
		.where(eq(users.id, userId))
		.then((result) => result[0]);
};
