import { AppLoadContext } from "@remix-run/cloudflare";
import ky from "ky";

export const post = async (context: AppLoadContext, endpoint: string, form: FormData) => {
	return await ky.post(`${context.cloudflare.env.GAME_MASTER_URL}/${endpoint}`, {
		headers: {
			Authorization: `Bearer ${context.cloudflare.env.AUTH_KEY}`,
		},
		body: form,
	});
};
export const deleteWithForm = async (
	context: AppLoadContext,
	endpoint: string,
	form: FormData,
) => {
	return await ky.delete(`${context.cloudflare.env.GAME_MASTER_URL}/${endpoint}`, {
		headers: {
			Authorization: `Bearer ${context.cloudflare.env.AUTH_KEY}`,
		},
		body: form,
	});
};
export const patch = async (
	context: AppLoadContext,
	endpoint: string,
	form: FormData,
) => {
	return await ky.patch(`${context.cloudflare.env.GAME_MASTER_URL}/${endpoint}`, {
		headers: {
			Authorization: `Bearer ${context.cloudflare.env.AUTH_KEY}`,
		},
		body: form,
	});
};
export const put = async (context: AppLoadContext, endpoint: string, form: FormData) => {
	return await ky.put(`${context.cloudflare.env.GAME_MASTER_URL}/${endpoint}`, {
		headers: {
			Authorization: `Bearer ${context.cloudflare.env.AUTH_KEY}`,
		},
		body: form,
	});
};
