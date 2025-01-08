import jwt from "jsonwebtoken";
import { env } from "../lib/env";

// JWT for server-to-server communication
export const generateServerToken = (userId: string) => {
	return jwt.sign({ userId }, env.SERVER_SECRET, { expiresIn: "1h" });
};
