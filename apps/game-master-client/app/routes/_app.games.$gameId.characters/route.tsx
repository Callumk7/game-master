import { Outlet } from "react-router";
import { Container } from "~/components/container";

export default function CharacterLayout() {
  return (
    <Container>
      <Outlet />
    </Container>
  );
}
