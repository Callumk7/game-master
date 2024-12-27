import type { ActionFunctionArgs } from "react-router";
import { Outlet } from "react-router";
import { createFolder } from "~/actions/folders.server";
import { Container } from "~/components/container";
import { createApiFromReq } from "~/lib/api.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { api, userId } = await createApiFromReq(request);
  return await createFolder(request, api, userId);
};

export default function FolderLayout() {
  return (
    <Container>
      <Outlet />
    </Container>
  );
}
