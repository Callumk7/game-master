import { Outlet } from "react-router";
import { Container } from "~/components/container";

export default function NotesLayout() {
  return (
    <Container>
      <Outlet />
    </Container>
  );
}
