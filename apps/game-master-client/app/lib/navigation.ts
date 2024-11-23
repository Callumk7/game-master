import { redirect } from "remix-typedjson";

type SuccessRedirectOptions = {
	path: string;
	message?: string;
	searchParams?: URLSearchParams | Record<string, string>;
};

const createSuccessRedirect = ({
	path,
	message = "Task was completed successfully",
	searchParams,
}: SuccessRedirectOptions) => {
	const params = new URLSearchParams(searchParams);
	params.set("success", "true");
	params.set("message", message);

	return `${path}?${params.toString()}`;
};

export const successRedirect = (args: SuccessRedirectOptions) => {
	return redirect(createSuccessRedirect(args));
};
