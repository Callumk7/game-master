import "dotenv/config";

if (!process.env.SERVER_SECRET) {
	throw new Error("SERVER_SECRET not set in the environment");
}
if (!process.env.DB_URL) {
	throw new Error("DB_URL not set in the environment");
}
if (!process.env.S3_ACCESS_KEY) {
	throw new Error("S3_ACCESS_KEY not set in the environment");
}
if (!process.env.S3_SECRET_KEY) {
	throw new Error("S3_SECRET_KEY not set in the environment");
}

export const env = {
	isDevelopment: process.env.NODE_ENV === "development",
	SERVER_SECRET: process.env.SERVER_SECRET,
	DB_URL: process.env.DB_URL,
	S3_ACCESS_KEY: process.env.S3_ACCESS_KEY,
	S3_SECRET_KEY: process.env.S3_SECRET_KEY,
};
