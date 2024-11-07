ALTER TABLE "characters_in_factions" DROP CONSTRAINT "characters_in_factions_character_id_characters_id_fk";
--> statement-breakpoint
ALTER TABLE "characters_in_factions" DROP CONSTRAINT "characters_in_factions_faction_id_factions_id_fk";
--> statement-breakpoint
ALTER TABLE "characters_permissions" DROP CONSTRAINT "characters_permissions_user_id_users_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "characters_in_factions" ADD CONSTRAINT "characters_in_factions_character_id_characters_id_fk" FOREIGN KEY ("character_id") REFERENCES "public"."characters"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "characters_in_factions" ADD CONSTRAINT "characters_in_factions_faction_id_factions_id_fk" FOREIGN KEY ("faction_id") REFERENCES "public"."factions"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "characters_permissions" ADD CONSTRAINT "characters_permissions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
