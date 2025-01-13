import { createFileRoute } from '@tanstack/react-router'
import { SDK } from '@repo/api'

const SERVER_URL = 'http://localhost:3000'
const api = new SDK({
  baseUrl: SERVER_URL,
  apiKey: localStorage.getItem('jwt_token')!,
})

export const Route = createFileRoute('/_authenticated/games/$gameId/')({
  component: RouteComponent,
  loader: ({ params: { gameId } }) => api.games.getAllGameEntities(gameId),
})

function RouteComponent() {
  return (
    <div>
      <p>Hello "/games/$gameId/"!</p>
      <div>
        <div>
          {Route.useLoaderData().notes.map((note) => (
            <div key={note.id}>
              <h2>{note.name}</h2>
            </div>
          ))}
        </div>
        <div>
          {Route.useLoaderData().characters.map((note) => (
            <div key={note.id}>
              <h2>{note.name}</h2>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
