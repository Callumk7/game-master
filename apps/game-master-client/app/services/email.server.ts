import aws from "@aws-sdk/client-ses";
import nodemailer from "nodemailer";
import { emailConfig } from "~/config";
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
		this.useSesInDev = env.USE_SES_IN_DEV === "true";

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
			const sesClient = new aws.SESClient({
				region: emailConfig.ses.region,
				credentials: {
					accessKeyId: emailConfig.ses.credentials.accessKeyId,
					secretAccessKey: emailConfig.ses.credentials.secretAccessKey,
				},
			});

			this.transporter = nodemailer.createTransport({
				SES: {
					ses: sesClient,
					aws,
				},
			});
		}
	}
	async sendEmail({ to, subject, html }: EmailOptions) {
		try {
			const info = await this.transporter.sendMail({
				from: emailConfig.ses.fromAddress,
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

	async verifyConnection() {
		try {
			await this.transporter.verify();
			console.log("Email service connection verified");
			return true;
		} catch (error) {
			console.error("Email service connection failed:", error);
			return false;
		}
	}
}

export const emailService = new EmailService();
