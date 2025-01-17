ALTER TABLE "diagram" ADD COLUMN "isFavorite" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "document" ADD COLUMN "isFavorite" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "form" ADD COLUMN "isFavorite" boolean DEFAULT false NOT NULL;