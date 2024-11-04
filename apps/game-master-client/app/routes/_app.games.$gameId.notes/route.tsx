import { Outlet } from "@remix-run/react";
import { Container } from "~/components/container";

export default function NotesLayout() {
  return (
    <Container>
      <Outlet />
    </Container>
  );
}
