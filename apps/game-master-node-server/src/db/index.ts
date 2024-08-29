import * as usersSchema from "./schema/users";

import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";

const queryClient = postgres(process.env.DB_URL_STAGING!);
export const db = drizzle(queryClient, { schema: usersSchema });
