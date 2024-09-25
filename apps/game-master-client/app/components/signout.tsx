import { Button } from "./ui/button";

export function SignoutButton() {
  return (
    <form method="POST" action="/logout">
      <Button variant={"outline"} type="submit">
        Logout
      </Button>
    </form>
  );
}
