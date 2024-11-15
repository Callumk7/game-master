import { env } from "./lib/env.server";

// Email Server
export const emailConfig = {
	ses: {
		region: env.AWS_REGION,
		credentials: {
			accessKeyId: env.AWS_ACCESS_KEY_ID!,
			secretAccessKey: env.AWS_SECRET_ACCESS_KEY!,
		},
		fromAddress: env.EMAIL_FROM_ADDRESS,
	},
};
