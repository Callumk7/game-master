ALTER TABLE "notes" ALTER COLUMN "folder_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "folders" ADD COLUMN "is_default" boolean DEFAULT false NOT NULL;