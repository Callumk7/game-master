import type { ActionFunctionArgs } from "@remix-run/cloudflare";
import { Outlet } from "@remix-run/react";
import { internalServerError, methodNotAllowed } from "@repo/db";
import ky from "ky";
import { z } from "zod";
import { zx } from "zodix";
import { MainContainer } from "~/components/layout";
import { postDelete } from "~/lib/game-master";

export const action = async ({ request, context }: ActionFunctionArgs) => {
	if (request.method === "DELETE") {
    const form = await request.formData();
		// handle delete character
		const { characterId } = await zx.parseForm(request, { characterId: z.string() });
    const res = await postDelete(context, `characters/${characterId}`, form)
		if (res.ok) {
			console.log(`${characterId} was deleted successfully`);
			return null;
		}
		return internalServerError();
	}
	return methodNotAllowed();
};

export default function CharactersRoute() {
	return (
		<MainContainer width="max" top="none" bottom="none">
			<Outlet />
		</MainContainer>
	);
}
