import { Button } from "./ui/button";

export function SignoutButton() {
	return (
		<form method="POST" action="/logout">
			<Button variant={"outline"} size={"sm"} type="submit">
				Logout
			</Button>
		</form>
	);
}
