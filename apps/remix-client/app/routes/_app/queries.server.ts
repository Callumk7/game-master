import { AppLoadContext } from "@remix-run/cloudflare";
import { allUserDataSchema } from "@repo/db";
import { createApi } from "~/lib/game-master";

export const getAllUserData = async (userId: string, context: AppLoadContext) => {
	const userDataResult = await createApi(context)
		.get("", { searchParams: { userId } })
		.json();
	return allUserDataSchema.parse(userDataResult);
};
