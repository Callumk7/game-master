ALTER TABLE "characters_permissions" ADD COLUMN "permission" "permission" NOT NULL;--> statement-breakpoint
ALTER TABLE "factions_permissions" ADD COLUMN "permission" "permission" NOT NULL;--> statement-breakpoint
ALTER TABLE "characters_permissions" DROP COLUMN IF EXISTS "can_view";--> statement-breakpoint
ALTER TABLE "characters_permissions" DROP COLUMN IF EXISTS "can_edit";--> statement-breakpoint
ALTER TABLE "factions_permissions" DROP COLUMN IF EXISTS "can_view";--> statement-breakpoint
ALTER TABLE "factions_permissions" DROP COLUMN IF EXISTS "can_edit";