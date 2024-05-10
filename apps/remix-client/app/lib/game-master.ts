import { AppLoadContext } from "@remix-run/cloudflare";
import ky from "ky";

export class GameMaster {
	private url: string;

	constructor(url: string) {
		this.url = url;
	}

	static create(context: AppLoadContext) {
		return new GameMaster(context.cloudflare.env.GAME_MASTER_URL);
	}

	async post(endpoint: string, body: FormData) {
		return await ky.post(`${this.url}/${endpoint}`, { body: body });
	}

	async patch(endpoint: string, body: unknown) {
		return await ky.patch(`${this.url}/${endpoint}`, { json: body });
	}

	async put(endpoint: string, body: unknown) {
		return await ky.put(`${this.url}/${endpoint}`, { json: body });
	}

	async delete(endpoint: string) {
		return await ky.delete(`${this.url}/${endpoint}`);
	}
}
