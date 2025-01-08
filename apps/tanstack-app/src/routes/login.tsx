import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEventHandler } from "react";

export const Route = createFileRoute("/login")({
  component: RouteComponent,
});

function RouteComponent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const onSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    // handle authentication
    const res = await fetch("http://localhost:3000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const { token } = await res.json();
    localStorage.setItem("jwt_token", token);
    alert("Authenticated");
  };
  return (
    <div>
      <form
        method="POST"
        className="flex flex-col gap-2 w-1/2 mx-auto"
        onSubmit={onSubmit}
      >
        <input
          type="text"
          name="email"
          className="border border-red-300"
          onInput={(e) => setEmail(e.currentTarget.value)}
        />
        <input
          type="password"
          name="password"
          className="border border-red-300"
          onInput={(e) => setPassword(e.currentTarget.value)}
        />
        <button type="submit" className="bg-red-500">
          Login
        </button>
      </form>
    </div>
  );
}
