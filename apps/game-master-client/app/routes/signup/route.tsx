import { useNavigate } from "@remix-run/react";
import type { BetterFetchError } from "better-auth/react";
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

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<BetterFetchError | null>(null);
  const [buttonHasError, setButtonHasError] = useState(!!error);

  const [isSuccess, setIsSuccess] = useState(false);

  const navigate = useNavigate();

  const handleEmailInput = (e: FormEvent<HTMLInputElement>) => {
    setEmail(e.currentTarget.value);
    setButtonHasError(false);
  };

  const handlePasswordInput = (e: FormEvent<HTMLInputElement>) => {
    setPassword(e.currentTarget.value);
    setButtonHasError(false);
  };

  const handleNameInput = (e: FormEvent<HTMLInputElement>) => {
    setName(e.currentTarget.value);
    setButtonHasError(false);
  };

  const handleSignUp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await authClient.signUp.email(
      {
        email,
        password,
        name,
      },
      {
        onRequest: () => {
          setError(null);
          setIsLoading(true);
        },
        onSuccess: () => {
          navigate("/");
          setError(null);
          setIsSuccess(true);
        },
        onError: (ctx) => {
          setIsLoading(false);
          setError(ctx.error);
          setButtonHasError(true);
        },
      },
    );
  };
  return (
    <div className="flex flex-col justify-center items-center h-screen">
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
              onInput={handleNameInput}
            />
            <JollyTextField
              name="email"
              label="Email"
              type="text"
              isRequired
              value={email}
              onInput={handleEmailInput}
            />
            <JollyTextField
              name="password"
              label="Password"
              type="password"
              isRequired
              value={password}
              onInput={handlePasswordInput}
            />
            <div className="flex flex-col space-y-2">
              <Button
                type="submit"
                isDisabled={isLoading}
                variant={buttonHasError ? "destructive" : "default"}
              >
                {isLoading ? "Loading" : isSuccess ? "👍" : "Login"}
              </Button>
              <Link variant={"secondary"} href="/login">
                Already have an account? Sign in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
      {error && <p className="text-destructive font-bold mt-5">{error.message}</p>}
    </div>
  );
}
