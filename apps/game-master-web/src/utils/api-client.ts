import { client } from "~/api/client.gen";
import { useAppSession } from "./session";

export async function configureApiClient() {
	const session = await useAppSession();

	if (session.data.token) {
		client.setConfig({
			headers: {
				Authorization: `Bearer ${session.data.token}`,
			},
		});
	} else {
		client.setConfig({
			headers: {
				Authorization: null,
			},
		});
	}
}
