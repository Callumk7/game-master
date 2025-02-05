import { useNavigate } from "@remix-run/react";
import { useAlligator } from "alligator-auth";
import { type FormEvent, useState } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardHeader, CardTitle } from "~/components/ui/card";
import { Link } from "~/components/ui/link";
import { JollyTextField } from "~/components/ui/textfield";

export default function LoginRoute() {
  const auth = useAlligator();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const loginSuccess = await auth.login(email, password);
    if (loginSuccess) {
      await auth.getCurrentUser();
      navigate("/");
    }
  };
  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="mx-auto md:w-1/2">
        <CardHeader>
          <CardTitle>Welcome back!</CardTitle>
        </CardHeader>
        <form onSubmit={handleLogin} className="p-6 space-y-4">
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
          <div className="flex flex-col gap-2">
            <Button type="submit">Login</Button>
            <Link variant={"secondary"} href={"/signup"}>
              Need an account? Sign up
            </Link>
            <Link variant={"secondary"} href={"/reset-password"}>
              Forgotten Password?
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
}
