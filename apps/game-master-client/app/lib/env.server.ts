// When module is IMPORTED, throw error if there is no API key set
if (!process.env.SERVER_SECRET) {
	throw new Error("SERVER_SECRET is not set in the environment");
}
if (!process.env.DB_URL) {
	throw new Error("DB_URL is not set in the environment");
}
export const env = {
	SERVER_SECRET: process.env.SERVER_SECRET,
	DB_URL: process.env.DB_URL,
	SERVER_URL: process.env.SERVER_URL || "http://localhost:3000"
}
