import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { loginUser } from "~/api";
import { Login } from "~/components/Login";
import { configureApiClient } from "~/utils/api-client";
import { useAppSession } from "~/utils/session";

export const loginFn = createServerFn({ method: "POST" })
  .validator((d: { email: string; password: string }) => d)
  .handler(async ({ data }) => {
    const { data: loginData, error } = await loginUser({ body: data });

    if (error) {
      return {
        error: true,
        message: "There was an error",
        userNotFound: true,
      };
    }

    // Create a session
    const session = await useAppSession();

    // Store the user's email in the session
    await session.update({
      userEmail: loginData.user.email,
      id: loginData.user.id,
      token: loginData.token,
    });

    await configureApiClient();
  });

export const Route = createFileRoute("/_auth")({
  beforeLoad: ({ context }) => {
    if (!context.user) {
      throw new Error("Not authenticated");
    }
  },
  errorComponent: ({ error }) => {
    if (error.message === "Not authenticated") {
      return <Login />;
    }

    throw error;
  },
});
