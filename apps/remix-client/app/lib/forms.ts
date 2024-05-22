import { validateUser } from "./auth";

export const getFormAndAppendUserId = async (request: Request) => {
	const validUserId = await validateUser(request);
	const form = await request.formData();
	form.append("userId", validUserId);
	return form;
};
