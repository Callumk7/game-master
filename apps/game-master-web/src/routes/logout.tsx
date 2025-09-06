import { redirect, createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { logoutUser } from "~/api";
import { configureApiClient } from "~/utils/api-client";
import { useAppSession } from "~/utils/session";

const logoutFn = createServerFn().handler(async () => {
  const session = await useAppSession();

  await configureApiClient();
  await logoutUser();

  session.clear();

  throw redirect({
    href: "/",
  });
});

export const Route = createFileRoute("/logout")({
  preload: false,
  loader: () => logoutFn(),
});
