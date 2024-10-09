DO $$ BEGIN
 CREATE TYPE "public"."note_type" AS ENUM('note', 'character', 'faction', 'location', 'item', 'quest');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "notes" ALTER COLUMN "type" SET DATA TYPE note_type;--> statement-breakpoint
ALTER TABLE "notes" ALTER COLUMN "type" DROP NOT NULL;