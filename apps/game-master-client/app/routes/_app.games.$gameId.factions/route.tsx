import { Outlet } from "@remix-run/react";
import { Container } from "~/components/container";

export default function FactionLayout() {
  return (
    <Container>
      <Outlet />
    </Container>
  );
}
