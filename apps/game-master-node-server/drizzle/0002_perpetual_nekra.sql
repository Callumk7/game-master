DO $$ BEGIN
 CREATE TYPE "public"."visibility" AS ENUM('public', 'private', 'viewable', 'partial');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "users_to_games" ALTER COLUMN "is_owner" SET DEFAULT false;--> statement-breakpoint
ALTER TABLE "users_to_games" ALTER COLUMN "role" SET DEFAULT 'player';--> statement-breakpoint
ALTER TABLE "notes" ADD COLUMN "visibility" "visibility" DEFAULT 'private' NOT NULL;