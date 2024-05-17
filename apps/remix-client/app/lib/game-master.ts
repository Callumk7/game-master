import { AppLoadContext } from "@remix-run/cloudflare";
import ky from "ky";

export const createApi = (context: AppLoadContext) => {
	return ky.create({
		prefixUrl: `${context.cloudflare.env.GAME_MASTER_URL}`,
		headers: {
			Authorization: `Bearer ${context.cloudflare.env.AUTH_KEY}`,
		},
	});
};

export const post = async (context: AppLoadContext, endpoint: string, form: FormData) => {
	return await createApi(context).post(endpoint, { body: form });
};

export const postDelete = async (
	context: AppLoadContext,
	endpoint: string,
	form: FormData,
) => {
	return await createApi(context).delete(endpoint, { body: form });
};

export const patch = async (
	context: AppLoadContext,
	endpoint: string,
	form: FormData,
) => {
	return await createApi(context).patch(endpoint, { body: form });
};

export const put = async (context: AppLoadContext, endpoint: string, form: FormData) => {
	return await createApi(context).put(endpoint, { body: form });
};
