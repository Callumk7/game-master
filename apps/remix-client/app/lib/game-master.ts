import { AppLoadContext } from "@remix-run/cloudflare";
import ky from "ky";

export class GameMaster {
	readonly url: string;

	constructor(url: string) {
		this.url = url;
	}

	static create(context: AppLoadContext) {
		return new GameMaster(context.cloudflare.env.GAME_MASTER_URL);
	}

	async patch(endpoint: string, body: unknown) {
		const res = await ky.patch(`${this.url}/${endpoint}`, { json: body });
		return res.statusText;
	}
}
