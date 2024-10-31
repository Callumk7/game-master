import "dotenv/config";

if (!process.env.SERVER_SECRET) {
	throw new Error("SERVER_SECRET not set in the environment");
}
if (!process.env.DB_URL) {
	throw new Error("DB_URL not set in the environment");
}

export const env = {
	SERVER_SECRET: process.env.SERVER_SECRET,
	DB_URL: process.env.DB_URL,
};
