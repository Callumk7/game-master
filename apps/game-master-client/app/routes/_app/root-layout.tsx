import { Outlet, useHref, useNavigate } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-aria-components";
import { Toaster } from "sonner";
import { DiceWidget } from "~/components/dice/dice-roller";
import { SuccessRedirectHandler } from "~/components/success-redirect-handler";
import { GlobalStateProvider } from "~/store/global";

export function AppLayout() {
  const navigate = useNavigate();
  const queryClient = new QueryClient();

  return (
    <RouterProvider navigate={navigate} useHref={useHref}>
      <QueryClientProvider client={queryClient}>
        <GlobalStateProvider gameSelectionId={""}>
          <SuccessRedirectHandler>
            <Toaster
              toastOptions={{
                className: "bg-popover text-popover-foreground border-border",
              }}
            />
            <Outlet />
            <DiceWidget />
          </SuccessRedirectHandler>
        </GlobalStateProvider>
      </QueryClientProvider>
    </RouterProvider>
  );
}
