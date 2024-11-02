import type React from "react";
import type { ReactElement } from "react";
import { render, type RenderOptions } from "@testing-library/react";
import { GlobalStateProvider } from "~/store/global";

function AllProviders({ children }: { children: React.ReactNode }) {
  return (
    <GlobalStateProvider gameSelectionId="game-test123">{children}</GlobalStateProvider>
  );
}

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, "wrapper">) =>
  render(ui, { wrapper: AllProviders, ...options });

export * from "@testing-library/react";
export { customRender as render };
