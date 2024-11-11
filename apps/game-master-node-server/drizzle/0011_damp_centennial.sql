ALTER TABLE "links" RENAME COLUMN "description" TO "label";--> statement-breakpoint
ALTER TABLE "notes_on_characters" ADD COLUMN "label" text;--> statement-breakpoint
ALTER TABLE "notes_on_factions" ADD COLUMN "label" text;