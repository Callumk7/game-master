ALTER TABLE "notes_permissions" DROP CONSTRAINT "notes_permissions_note_id_notes_id_fk";
--> statement-breakpoint
ALTER TABLE "notes_permissions" DROP CONSTRAINT "notes_permissions_user_id_users_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "notes_permissions" ADD CONSTRAINT "notes_permissions_note_id_notes_id_fk" FOREIGN KEY ("note_id") REFERENCES "public"."notes"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "notes_permissions" ADD CONSTRAINT "notes_permissions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
