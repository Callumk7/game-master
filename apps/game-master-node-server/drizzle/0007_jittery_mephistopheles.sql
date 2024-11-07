ALTER TABLE "characters_permissions" DROP CONSTRAINT "characters_permissions_character_id_characters_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "characters_permissions" ADD CONSTRAINT "characters_permissions_character_id_characters_id_fk" FOREIGN KEY ("character_id") REFERENCES "public"."characters"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
