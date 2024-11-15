if (!process.env.SERVER_SECRET) {
	throw new Error("SERVER_SECRET is not set in the environment");
}
if (!process.env.DB_URL) {
	throw new Error("DB_URL is not set in the environment");
}

const isDevelopment = process.env.NODE_ENV === "development";

if (!isDevelopment) {
	if (!process.env.SMTP_HOST) {
		throw new Error("SMTP_HOST is not set in the environment");
	}
	if (!process.env.SMTP_PORT) {
		throw new Error("SMTP_HOST is not set in the environment");
	}
	if (!process.env.SMTP_USER) {
		throw new Error("SMTP_USER is not set in the environment");
	}
	if (!process.env.SMTP_PASS) {
		throw new Error("SMTP_PASS is not set in the environment");
	}
}

export const env = {
	isDevelopment: isDevelopment,
	SERVER_SECRET: process.env.SERVER_SECRET,
	DB_URL: process.env.DB_URL,
	SERVER_URL: isDevelopment ? "http://localhost:3000" : process.env.SERVER_URL,
	APP_URL: isDevelopment ? "http://localhost:5173" : process.env.APP_URL,
	SMTP_HOST: isDevelopment ? "localhost" : process.env.SMTP_HOST!,
	SMTP_PORT: isDevelopment ? 1025 : Number(process.env.SMTP_PORT!),
	SMTP_USER: process.env.SMTP_USER!,
	SMTP_PASS: process.env.SMTP_PASS!,
	USE_SES_IN_DEV: process.env.USE_SES_IN_DEV === "true",
	AWS_REGION: process.env.AWS_REGION || "eu-west-1",
};
