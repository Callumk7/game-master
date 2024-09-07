import type { Id } from "./index.js";

export interface User {
	id: Id;
	firstName: string | undefined;
	lastName: string | undefined;
	username: string;
	email: string;
}
