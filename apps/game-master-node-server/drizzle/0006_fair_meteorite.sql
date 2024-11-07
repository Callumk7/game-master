ALTER TABLE "characters" ADD COLUMN "level" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "characters" ADD COLUMN "class" text;--> statement-breakpoint
ALTER TABLE "characters" ADD COLUMN "race" text;--> statement-breakpoint
ALTER TABLE "characters" ADD COLUMN "strength" integer;--> statement-breakpoint
ALTER TABLE "characters" ADD COLUMN "dexterity" integer;--> statement-breakpoint
ALTER TABLE "characters" ADD COLUMN "constitution" integer;--> statement-breakpoint
ALTER TABLE "characters" ADD COLUMN "intelligence" integer;--> statement-breakpoint
ALTER TABLE "characters" ADD COLUMN "wisdom" integer;--> statement-breakpoint
ALTER TABLE "characters" ADD COLUMN "charisma" integer;--> statement-breakpoint
ALTER TABLE "characters" ADD COLUMN "personality" text;--> statement-breakpoint
ALTER TABLE "characters" ADD COLUMN "goal" text;--> statement-breakpoint
ALTER TABLE "characters" ADD COLUMN "flaw" text;