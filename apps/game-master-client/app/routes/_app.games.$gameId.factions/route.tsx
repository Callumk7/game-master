import { Outlet } from "react-router";
import { Container } from "~/components/container";

export default function FactionLayout() {
  return (
    <Container>
      <Outlet />
    </Container>
  );
}
