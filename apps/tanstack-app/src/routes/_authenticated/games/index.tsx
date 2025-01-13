import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/games/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="bg-black">Hello "/games/"!</div>
  )
}
