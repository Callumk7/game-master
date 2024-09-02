import type { ActionFunctionArgs } from "@remix-run/node";
import { handleSignup } from "./queries.server";

export const action = async ({ request }: ActionFunctionArgs) => {
	console.log("1");
	return await handleSignup(request);
};

export default function SignupRoute() {
	return (
		<div>
			<form method="post" className="flex flex-col space-y-2 border border-black">
				<div>
					<label htmlFor="email">email</label>
					<input className="border p-1 mx-2" id="email" name="email" />
				</div>
				<div>
					<label htmlFor="password">Password</label>
					<input className="border p-1 mx-2" id="password" name="password" />
				</div>
				<button type="submit">Continue</button>
			</form>
		</div>
	);
}
