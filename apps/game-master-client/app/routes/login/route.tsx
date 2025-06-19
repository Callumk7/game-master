import { useNavigate } from "@remix-run/react";
import type { BetterFetchError } from "better-auth/react";
import { type FormEvent, useState } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardHeader, CardTitle } from "~/components/ui/card";
import { Link } from "~/components/ui/link";
import { JollyTextField } from "~/components/ui/textfield";
import { authClient } from "~/lib/auth-client";

export default function LoginRoute() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<BetterFetchError | null>(null);
  const [buttonHasError, setButtonHasError] = useState(!!error);

  const [isSuccess, setIsSuccess] = useState(false);

  const handleEmailInput = (e: FormEvent<HTMLInputElement>) => {
    setEmail(e.currentTarget.value);
    setButtonHasError(false);
  };

  const handlePasswordInput = (e: FormEvent<HTMLInputElement>) => {
    setPassword(e.currentTarget.value);
    setButtonHasError(false);
  };

  const navigate = useNavigate();

  const signIn = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Don't display password in the URL
    await authClient.signIn.email(
      {
        email,
        password,
      },
      {
        onRequest: () => {
          setError(null);
          setIsLoading(true);
        },
        onSuccess: () => {
          navigate("/");
          setError(null);
          setIsLoading(false);
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
          <CardTitle>Welcome back!</CardTitle>
        </CardHeader>
        <form onSubmit={signIn} className="p-6 space-y-4">
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
          <div className="flex flex-col gap-2">
            <Button
              variant={buttonHasError ? "destructive" : "default"}
              type="submit"
              isDisabled={isLoading}
            >
              {isLoading ? "Loading" : isSuccess ? "👍" : "Login"}
            </Button>
            <Link variant={"secondary"} href={"/signup"}>
              Need an account? Sign up
            </Link>
            <Link variant={"secondary"} href={"/reset-password"}>
              Forgotten Password?
            </Link>
          </div>
        </form>
      </Card>
      {error && <p className="text-destructive font-bold mt-5">{error.message}</p>}
    </div>
  );
}
