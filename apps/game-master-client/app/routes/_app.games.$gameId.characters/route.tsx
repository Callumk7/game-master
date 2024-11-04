import { Outlet } from "@remix-run/react";
import { Container } from "~/components/container";

export default function CharacterLayout() {
  return (
    <Container>
      <Outlet />
    </Container>
  );
}
