CREATE TABLE IF NOT EXISTS "characters_permissions" (
	"character_id" text NOT NULL,
	"user_id" text NOT NULL,
	"can_view" boolean NOT NULL,
	"can_edit" boolean DEFAULT false NOT NULL,
	CONSTRAINT "characters_permissions_user_id_character_id_pk" PRIMARY KEY("user_id","character_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "factions_permissions" (
	"faction_id" text NOT NULL,
	"user_id" text NOT NULL,
	"can_view" boolean NOT NULL,
	"can_edit" boolean DEFAULT false NOT NULL,
	CONSTRAINT "factions_permissions_user_id_faction_id_pk" PRIMARY KEY("user_id","faction_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "notes_permissions" (
	"note_id" text NOT NULL,
	"user_id" text NOT NULL,
	"can_view" boolean NOT NULL,
	"can_edit" boolean DEFAULT false NOT NULL,
	CONSTRAINT "notes_permissions_user_id_note_id_pk" PRIMARY KEY("user_id","note_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "characters_permissions" ADD CONSTRAINT "characters_permissions_character_id_characters_id_fk" FOREIGN KEY ("character_id") REFERENCES "public"."characters"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "characters_permissions" ADD CONSTRAINT "characters_permissions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "factions_permissions" ADD CONSTRAINT "factions_permissions_faction_id_factions_id_fk" FOREIGN KEY ("faction_id") REFERENCES "public"."factions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "factions_permissions" ADD CONSTRAINT "factions_permissions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "notes_permissions" ADD CONSTRAINT "notes_permissions_note_id_notes_id_fk" FOREIGN KEY ("note_id") REFERENCES "public"."notes"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "notes_permissions" ADD CONSTRAINT "notes_permissions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
