import type { Permission, Visibility } from "@repo/api";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { EntityToolbar } from "~/components/entity-toolbar";
import { useAppData } from "~/routes/_app/route";
import { render, screen, waitFor } from "../test-utils";

const mockSubmit = vi.fn();
const mockNavigate = vi.fn();

vi.mock("@remix-run/react", () => ({
  useSubmit: () => mockSubmit,
  useNavigate: () => mockNavigate,
}));

vi.mock("~/routes/_app/route", () => ({
  useAppData: () => ({ userId: "user-test123" }),
}));

describe("Entity Toolbar", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe("Main Toolbar", () => {
    const defaultProps = {
      entityOwnerId: "user-test981230",
      gameId: "game-test9103128",
      entityVisibility: "private" as Visibility,
      permissions: [],
      userPermissionLevel: "edit" as Permission,
      folders: [],
      setIsEditDialogOpen() {
        return undefined;
      },
    };

    test("Menu should open on click", async () => {
      render(<EntityToolbar {...defaultProps} />);

      await waitFor(() => screen.findByText("Menu"));
    });
  });
});
