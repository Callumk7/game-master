import { api } from "~/lib/api.server";
import { resolve } from "~/util/await-all";

export const getUserAppData = async (userId: string) => {
	const userCall = api.users.getUser(userId);
	const userDataCall = api.users.getAllUserDataWithNestedRelations(userId); // TODO: this should include the user's data;

	const [user, userData] = await resolve(userCall, userDataCall);
	console.dir(userData, {depth: null})

	return { user, userData };
};
