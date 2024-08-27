import { serve } from '@hono/node-server'
import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => {
	return c.text('Hello Hono!')
})

const port = 3000
console.log(`Server is running on port ${port}`)

serve({
	fetch: app.fetch,
	port
})

export default app;


////////////////////////////////////////////////////////////////////////////////
//                                Routes
////////////////////////////////////////////////////////////////////////////////

const userRoute = new Hono()

userRoute.get("/", (c) => c.text("This is the user route, please use the correct endpoint"))

userRoute.get("/:userId", async (c) => {
	// validate request shape

	// access correct user data
	// return user data
})


