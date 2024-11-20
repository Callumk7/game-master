ALTER TABLE "users" ADD COLUMN "email_verified" boolean;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "email_verification_token" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "email_verification_token_expiry" timestamp with time zone;