import { type FormEvent, useState } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Link } from "~/components/ui/link";
import { JollyTextField } from "~/components/ui/textfield";
import { authClient } from "~/lib/auth-client";

export default function SignUpRoute() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const [error, setError] = useState<string | null>(null);

  const handleSignUp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { data } = await authClient.signUp.email(
      {
        email,
        password,
        name,
        callbackURL: "/",
      },
      {
        onRequest: (ctx) => {},
        onSuccess: (ctx) => {},
        onError: (ctx) => {
          setError(ctx.error.message);
          console.error(ctx.error);
        },
      },
    );
  };
  return (
    <div className="flex justify-center items-center h-screen">
      <p className="text-red-400">{error}</p>
      <Card className="mx-auto md:w-1/2">
        <CardHeader>
          <CardTitle>Signup for Game Master</CardTitle>
        </CardHeader>
        <CardContent>
          <form method="POST" className="space-y-3" onSubmit={handleSignUp}>
            <JollyTextField
              name="username"
              label="Username"
              type="text"
              isRequired
              value={name}
              onInput={(e) => setName(e.currentTarget.value)}
            />
            <JollyTextField
              name="email"
              label="Email"
              type="text"
              isRequired
              value={email}
              onInput={(e) => setEmail(e.currentTarget.value)}
            />
            <JollyTextField
              name="password"
              label="Password"
              type="password"
              isRequired
              value={password}
              onInput={(e) => setPassword(e.currentTarget.value)}
            />
            <div className="flex flex-col space-y-2">
              <Button type="submit">Sign Up</Button>
              <Link variant={"secondary"} href="/login">
                Already have an account? Sign in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
