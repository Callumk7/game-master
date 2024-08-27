import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { db, users } from "@repo/db-new";
import { eq } from 'drizzle-orm';


const app = new Hono()

app.get('/', (c) => {
	return c.text('Hello Hono!')
})

////////////////////////////////////////////////////////////////////////////////
//                                Routes
////////////////////////////////////////////////////////////////////////////////

const userRoute = new Hono()

userRoute.get("/", (c) => c.text("This is the user route, please use the correct endpoint"))

userRoute.get("/:userId", async (c) => {
	const userId = c.req.param("userId");
	console.log(userId);
	const result = await db.query.users.findFirst({
		where: eq(users.id, Number(userId))
	})

	console.log(result);

	return c.json(result);
})


app.route("/users", userRoute)

const port = 3000
console.log(`Server is running on port ${port}`)

serve({
	fetch: app.fetch,
	port
})

export default app;
