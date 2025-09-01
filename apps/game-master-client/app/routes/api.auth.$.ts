import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { auth } from "~/lib/auth"; // Adjust the path as necessary

export async function loader({ request }: LoaderFunctionArgs) {
	console.log("Loader");
	return auth.handler(request);
}

export async function action({ request }: ActionFunctionArgs) {
	console.log("Action");
	return auth.handler(request);
}
