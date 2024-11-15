import nodemailer from "nodemailer";
import { SESClient } from "@aws-sdk/client-ses";
import { env } from "~/lib/env.server";

interface EmailOptions {
	to: string;
	subject: string;
	html: string;
}

class EmailService {
	private transporter: nodemailer.Transporter;
	private readonly isDevelopment: boolean;
	private readonly useSesInDev: boolean;

	constructor() {
		this.isDevelopment = env.isDevelopment;
		this.useSesInDev = env.USE_SES_IN_DEV;

		if (this.isDevelopment && !this.useSesInDev) {
			this.transporter = nodemailer.createTransport({
				host: env.SMTP_HOST,
				port: env.SMTP_PORT,
				secure: !env.isDevelopment,
				auth: env.isDevelopment
					? undefined
					: {
							user: env.SMTP_USER,
							pass: env.SMTP_PASS,
						},
			});
		} else {
			const sesClient = new SESClient({
				region: env.AWS_REGION,
			});

			this.transporter = nodemailer.createTransport({
				SES: {
					sesClient,
				},
			});
		}
	}
	async sendEmail({ to, subject, html }: EmailOptions) {
		try {
			const info = await this.transporter.sendMail({
				from: '"Game Master" <hello@callumkloos.dev>',
				to,
				subject,
				html,
			});

			if (env.isDevelopment) {
				console.log(`Message sent: ${info.messageId}`);
				console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
			}

			return { success: true, messageId: info.messageId };
		} catch (error) {
			console.error(error);
			return { success: false, error };
		}
	}
	async sendResetEmail(email: string, token: string) {
		await this.sendEmail({
			to: email,
			subject: "Password Reset Request",
			html: `
<p>Click the link below to reset your password</p>
<a href="${env.APP_URL}/reset-password/${token}">
Reset Password
</a>
`,
		});
	}
}

export const emailService = new EmailService();
