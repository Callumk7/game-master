import { ActionFunctionArgs } from "@remix-run/cloudflare";
import { Outlet } from "@remix-run/react";
import { internalServerError, methodNotAllowed } from "@repo/db";
import ky from "ky";
import { z } from "zod";
import { zx } from "zodix";
import { MainContainer } from "~/components/layout";

export const action = async ({ request, params, context }: ActionFunctionArgs) => {
	if (request.method === "DELETE") {
		// handle delete character
		const { characterId } = await zx.parseForm(request, { characterId: z.string() });
		const res = await ky.delete(
			`${context.cloudflare.env.GAME_MASTER_URL}/characters/${characterId}`,
			{
				headers: {
					Authorization: `Bearer ${context.cloudflare.env.AUTH_KEY}`,
				},
			},
		);
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
