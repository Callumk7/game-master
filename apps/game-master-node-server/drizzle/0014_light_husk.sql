ALTER TABLE "users_to_games" DROP CONSTRAINT "users_to_games_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "users_to_games" DROP CONSTRAINT "users_to_games_game_id_games_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users_to_games" ADD CONSTRAINT "users_to_games_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users_to_games" ADD CONSTRAINT "users_to_games_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
