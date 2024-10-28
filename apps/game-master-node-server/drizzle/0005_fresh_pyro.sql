ALTER TABLE "factions" DROP CONSTRAINT "factions_leader_id_characters_id_fk";
--> statement-breakpoint
ALTER TABLE "characters" ADD COLUMN "primary_faction_id" text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "characters" ADD CONSTRAINT "characters_primary_faction_id_factions_id_fk" FOREIGN KEY ("primary_faction_id") REFERENCES "public"."factions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "factions" DROP COLUMN IF EXISTS "leader_id";