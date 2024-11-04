import { Outlet, useHref, useNavigate } from "@remix-run/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-aria-components";
import { GlobalStateProvider } from "~/store/global";

export function AppLayout() {
  const navigate = useNavigate();

  const queryClient = new QueryClient();

  return (
    <RouterProvider navigate={navigate} useHref={useHref}>
      <QueryClientProvider client={queryClient}>
        <GlobalStateProvider gameSelectionId={""}>
          <Outlet />
        </GlobalStateProvider>
      </QueryClientProvider>
    </RouterProvider>
  );
}
