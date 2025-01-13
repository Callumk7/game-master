import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/a')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/a"!</div>
}
